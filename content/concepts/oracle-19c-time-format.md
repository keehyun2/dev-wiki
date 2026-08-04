# Oracle 19c 시간 포맷팅

**Oracle TO_CHAR** 함수와 시간 포맷 요소를 사용하여 다양한 시간 표현이 가능합니다.

## 기본 시간 포맷

### HHMISS 형식
```sql
-- 시:분:초 (24시간제)
SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS current_time
FROM dual;
-- 결과: 14:30:45

-- 구분자 없는 컴팩트 형식
SELECT TO_CHAR(SYSDATE, 'HH24MISS') AS time_compact
FROM dual;
-- 결과: 143045

-- 12시간제 + AM/PM
SELECT TO_CHAR(SYSDATE, 'HH:MI:SS AM') AS time_ampm
FROM dual;
-- 결과: 02:30:45 PM
```

### 시간 요소
```sql
-- 시간 (00-23)
SELECT TO_CHAR(SYSDATE, 'HH24') AS hour_24
FROM dual;
-- 결과: 14

-- 분 (00-59)
SELECT TO_CHAR(SYSDATE, 'MI') AS minutes
FROM dual;
-- 결과: 30

-- 초 (00-59)
SELECT TO_CHAR(SYSDATE, 'SS') AS seconds
FROM dual;
-- 결과: 45

-- 밀리초
SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS.FF3') AS with_millis
FROM dual;
-- 결과: 14:30:45.123
```

## 날짜/시간 조합

### 일반적인 조합
```sql
-- 전체 타임스탬프
SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS full_timestamp
FROM dual;
-- 결과: 2024-01-15 14:30:45

-- 파일명용 포맷
SELECT TO_CHAR(SYSDATE, 'YYYYMMDD_HH24MISS') AS filename_timestamp
FROM dual;
-- 결과: 20240115_143045

-- 로그용 포맷
SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS log_timestamp
FROM dual;
-- 결과: 2024-01-15 14:30:45.123
```

## 시간 추출 및 변환

### EXTRACT로 시간 추출
```sql
-- 시간 추출
SELECT EXTRACT(HOUR FROM SYSDATE) AS hour,
       EXTRACT(MINUTE FROM SYSDATE) AS minute,
       EXTRACT(SECOND FROM SYSDATE) AS second
FROM dual;
-- 결과: 14 | 30 | 45
```

### 시간 문자열 변환
```sql
-- 문자열을 시간으로 변환
SELECT TO_DATE('143045', 'HH24MISS') AS time_value
FROM dual;

-- AM/PM 형식 파싱
SELECT TO_DATE('02:30:45 PM', 'HH:MI:SS AM') AS pm_time
FROM dual;
```

## 시간 계산

### 시간 차이
```sql
-- 자정 이후 경과 초
SELECT (SYSDATE - TRUNC(SYSDATE)) * 24 * 60 * 60 AS seconds_since_midnight
FROM dual;

-- 두 시간 간 분 차이
SELECT (TO_DATE('2024-01-15 18:00:00', 'YYYY-MM-DD HH24:MI:SS') -
        TO_DATE('2024-01-15 14:30:00', 'YYYY-MM-DD HH24:MI:SS')) * 24 * 60
AS minutes_diff
FROM dual;
-- 결과: 210
```

### 시간 추가
```sql
-- 시간 추가
SELECT SYSDATE + INTERVAL '2' HOUR AS two_hours_later
FROM dual;

-- 분 추가
SELECT SYSDATE + (30/1440) AS thirty_mins_later
FROM dual;
```

## 실전 패턴

### 업무시간 체크
```sql
-- 업무시간 내인지 확인 (9-17시)
SELECT CASE
    WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) BETWEEN 9 AND 17
    THEN 'Business Hours'
    ELSE 'After Hours'
END AS business_status
FROM dual;
```

### 시간 반올림
```sql
-- 시간 단위로 내림
SELECT TRUNC(SYSDATE, 'HH24') AS hour_start
FROM dual;

-- 15분 단위로 내림
SELECT TRUNC(SYSDATE, 'MI') -
       MOD(EXTRACT(MINUTE FROM SYSDATE), 15) / (24*60) AS rounded_15min
FROM dual;
```

## 성능 최적화

### 효율적인 시간 쿼리
```sql
-- 날짜 비교 시 TRUNC 사용
SELECT * FROM orders
WHERE TRUNC(order_date) = TRUNC(SYSDATE);

-- 더 좋은 방법: 범위 사용
SELECT * FROM orders
WHERE order_date >= TRUNC(SYSDATE)
  AND order_date < TRUNC(SYSDATE) + 1;

-- ❌ 피해야 할 패턴
-- WHERE TO_CHAR(order_date, 'HH24') = '14'

-- ✅ 권장 패턴
-- WHERE order_date >= TRUNC(SYSDATE, 'HH') + 14/24
```

## 관련 페이지
- [[oracle-sql]] — Oracle SQL 종합 참조
- [[linux-commands]] — 시스템 관리
