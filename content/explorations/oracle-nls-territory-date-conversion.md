---
title: Oracle NLS_TERRITORY 날짜
---

한국에서는 `'YYYYMMDD'` 문자열이 날짜로 잘 변환되던 SQL이 베트남 서버에서 암묵 형변환 오류를 일으켰다. 로컬에서 `ALTER SESSION SET NLS_TERRITORY = 'VIETNAM'`만으로 동일하게 재현되었다.

**한 줄 결론**: 포맷 마스크 없는 `TO_DATE`·문자열-DATE 비교는 세션의 `NLS_DATE_FORMAT`을 따르고, 그 기본값은 `NLS_TERRITORY`에서 파생된다. 한국(연도 우선 `RR/MM/DD`)에서는 관용적 파싱(폴백) 덕에 `YYYYMMDD`가 통과했지만, 베트남(일 우선 `DD-MM-RRRR`)에서는 같은 문자열이 무효 월로 해석돼 실패한다.

## 증상

- 한국 서버: `TO_DATE('20240101')`처럼 포맷 마스크 없이 사용 → 정상 동작
- 베트남 서버: 동일 SQL → 오류 발생. `WHERE order_date = '20240101'` 같은 문자열 비교도 같은 이유로 실패

## 재현

```sql
-- 기본(KOREA → RR/MM/DD): 관용적 파싱 덕에 통과
SELECT TO_DATE('20240101') FROM DUAL;         -- 정상

-- territory만 바꾸면 실패
ALTER SESSION SET NLS_TERRITORY = 'VIETNAM';  -- → DD-MM-RRRR

SELECT TO_DATE('20240101') FROM DUAL;
-- ORA-01843: 지정한 월이 부적합합니다
-- (입력값·포맷 조합에 따라 ORA-01861, ORA-01858 등 포맷 불일치 계열 오류)
```

territory만 바꿔도 재현된다 → 원인은 territory 자체가 아니라, territory 변경 시 **함께 리셋되는 파생 파라미터**다. 세션 값 확인:

```sql
SELECT parameter, value
FROM nls_session_parameters
WHERE parameter IN ('NLS_TERRITORY', 'NLS_DATE_FORMAT', 'NLS_DATE_LANGUAGE');
```

## 원인 분석

### 1. 암묵 형변환은 세션의 NLS_DATE_FORMAT으로 해석한다

```sql
TO_DATE('20240101')             -- TO_DATE('20240101', <세션 NLS_DATE_FORMAT>)과 동일
WHERE order_date = '20240101'   -- 문자열 리터럴이 DATE로 암묵 변환됨
```

### 2. NLS_DATE_FORMAT 기본값은 NLS_TERRITORY에서 파생된다

NLS 파라미터 결정 우선순위:

1. SQL 함수 명시 — `TO_DATE(str, fmt)` 포맷 마스크, 3번째 인자 `NLS_DATE_LANGUAGE=...`
2. `ALTER SESSION`
3. 클라이언트 환경변수 — `NLS_LANG`, `NLS_DATE_FORMAT` (단, `NLS_DATE_FORMAT`은 `NLS_LANG`이 함께 설정돼 있어야 적용됨)
4. DB 초기화 파라미터 — spfile / init.ora
5. `NLS_TERRITORY` 파생 기본값

`ALTER SESSION SET NLS_TERRITORY`를 실행하면 파생 파라미터(`NLS_DATE_FORMAT`, `NLS_NUMERIC_CHARACTERS`, `NLS_CURRENCY`, `NLS_ISO_CURRENCY`)가 해당 territory 기본값으로 **리셋**된다. 날짜 포맷을 직접 건드리지 않았는데도 재현되는 이유.

### 3. territory별 기본 날짜 포맷이 다르다

| NLS_TERRITORY | NLS_DATE_FORMAT 기본값 |
| ------------- | ---------------------- |
| KOREA         | `RR/MM/DD`             |
| VIETNAM       | `DD-MM-RRRR`           |
| AMERICA       | `DD-MON-RR`            |

`'20240101'`을 `DD-MM-RRRR`로 해석하면 DD=20, MM=24 → 월 24는 없으므로 실패. 반면 `RR/MM/DD`에서는 같은 문자열이 **통과한다** — 이유는 다음 절.

### 4. 왜 RR/MM/DD에서는 YYYYMMDD가 통과하나 — 관용적 파싱 규칙

TO_DATE의 문자열→날짜 변환은 `FX` 수정자를 쓰지 않는 한 관용적으로 동작한다(Oracle 문서 "String-to-Date Conversion Rules"):

- 포맷에 포함된 구두점은 입력에서 생략할 수 있다 — 각 숫자 요소가 최대 자릿수를 채울 때. `TO_DATE('0207', 'MM/YY')` → 정상
- 구두점 자리에는 임의의 비영숫자 문자가 올 수 있다. `TO_DATE('02#07', 'MM/YY')` → 정상
- 포맷 뒤쪽의 시간 필드는 입력에서 생략할 수 있다
- **요소 매칭에 실패하면 대체 포맷 요소를 시도한다:**

| 원래 요소 | 대체로 시도할 요소 |
| --------- | ------------------ |
| MM        | MON, MONTH         |
| MON       | MONTH              |
| MONTH     | MON                |
| YY        | YYYY               |
| RR        | RRRR               |

실측 확인: `SELECT TO_DATE('20261020', 'RR/MM/DD') FROM DUAL` → **에러 없이 2026-10-20** 반환. RR(2자리)로만 파싱하면 MM=26이 돼 실패하지만, RR→RRRR 폴백으로 앞 4자리 `2026`을 연도가 흡수한 뒤 MM=10, DD=20이 성립한다. 연도가 맨 앞에 온 포맷(`RR/MM/DD`, `YY/MM/DD` 등)은 8자리 `YYYYMMDD`를 이런 방식으로 흡수한다.

### 5. 핵심: 관용 파싱은 포맷의 "방향"에 의존한다

같은 8자리 문자열이라도 territory 기본 포맷의 요소 순서에 따라 성패가 갈린다:

- **KOREA `RR/MM/DD`(연도 우선)** — RRRR 폴백으로 연도가 앞 4자리를 흡수 → 통과
- **VIETNAM `DD-MM-RRRR`(일 우선)** — DD가 먼저 2자리를 가져가고, MM 슬롯에 4~5번째 자리(`24`)가 들어감 → 무효 월. DD에는 대체 요소도 없다

즉 한국에서 "잘 됐던" 것은 세션 포맷의 관용적 파싱에 기댄 것이지, SQL이 이식성 있게 작동했던 게 아니다. territory가 바뀌면 세션 포맷이 바뀌고, 같은 코드가 다르게 해석된다.

### 어느 레벨에서 설정됐는지 확인

```sql
-- 현재 세션에 실제 적용된 값 (우선순위가 모두 반영된 결과)
SELECT * FROM nls_session_parameters;

-- DB 생성 시 기본값
SELECT * FROM nls_database_parameters;

-- spfile/init.ora 설정값
SELECT * FROM nls_instance_parameters;
```

세션 값과 인스턴스 값이 다르면 클라이언트 환경변수나 로그온 트리거 개입을 의심한다.

## 해결·예방

```sql
-- 1. 포맷 마스크를 항상 명시한다 (근본 해결)
SELECT TO_DATE('20240101', 'YYYYMMDD') FROM DUAL;

-- 2. 리터럴 비교는 ANSI DATE 리터럴을 쓴다 (territory 무관, 시각 없음)
SELECT * FROM orders
WHERE order_date >= DATE '2024-01-01'
  AND order_date <  DATE '2024-01-02';

-- 3. 월 이름(MON) 포맷은 언어 의존이므로 3번째 인자로 고정한다
SELECT TO_DATE('15-JAN-2024', 'DD-MON-YYYY', 'NLS_DATE_LANGUAGE=AMERICAN') FROM DUAL;
```

- 출력도 마찬가지: `TO_CHAR(date_col)` → `TO_CHAR(date_col, 'YYYYMMDD')`
- 애플리케이션에서는 문자열이 아니라 DATE/TIMESTAMP 타입으로 바인딩한다
- `ALTER SESSION SET NLS_DATE_FORMAT = 'YYYYMMDD'`는 임시 방편 — 커넥션 풀 환경에서는 세션마다 초기화(logon trigger 등)가 필요하고 코드의 암묵 변환을 없애는 근본 해결이 아니다
- 암묵 변환은 정확성만이 아니라 성능(인덱스 미사용) 문제의 원인이 되기도 하므로, 날짜 암묵 변환에 의존하는 SQL 자체를 없애는 것이 정답

## 같은 원리로 터질 수 있는 것들

| 파라미터                 | 영향                       | 비고                                                                        |
| ------------------------ | -------------------------- | --------------------------------------------------------------------------- |
| `NLS_NUMERIC_CHARACTERS` | 소수점·천단위 구분자       | VIETNAM은 `',.'` — 소수점이 콤마. `TO_NUMBER`/`TO_CHAR` 숫자 암묵 변환 주의 |
| `NLS_DATE_LANGUAGE`      | `MON` 요소(월 이름)의 언어 | NLS_LANGUAGE에서 파생. 포맷에 `MON`이 있으면 언어도 함께 고정               |
| `NLS_SORT`               | 문자열 정렬 순서           | 언어별 정렬이 인덱스 정렬과 불일치하면 성능 문제                            |

새 리전·서버로 이관할 때는 세션 파라미터 diff(`nls_session_parameters`)를 먼저 확인한다.

## 참고 자료

- Oracle SQL Language Reference — [Format Models: String-to-Date Conversion Rules](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/Format-Models.html) (구두점 생략·대체 요소 폴백 규칙)
- Oracle Database Reference — [NLS_DATE_FORMAT](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/NLS_DATE_FORMAT.html), [NLS_TERRITORY](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/NLS_TERRITORY.html)
- Franck Pachot — [NLS defaults for LANGUAGE and TERRITORY](https://www.dbi-services.com/blog/nls-defaults-for-language-and-territory/) (전 territory 기본값 실측 테이블)

## 관련 페이지

- [[oracle-19c-time-format]] — Oracle 19c 시간 포맷팅
- [[oracle-sql]] — Oracle SQL 필수 문법
