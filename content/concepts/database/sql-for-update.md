---
title: SQL FOR UPDATE 행 잠금
---

`SELECT ... FOR UPDATE`는 조회한 행에 **배타 잠금(행 락)**을 거는 SQL 구문입니다. 잠긴 행은 트랜잭션이 끝날 때까지 다른 트랜잭션이 수정하거나 다시 잠글 수 없습니다. "읽고 → 검사하고 → 수정하는" 흐름에서 같은 행을 동시에 다룰 때 생기는 경쟁 조건을 막는 것이 주 용도입니다.

## 왜 필요한가 — Lost Update

재고가 1개 남은 상품을 두 트랜잭션이 동시에 주문하는 경우입니다.

| 시각 | 트랜잭션 A            | 트랜잭션 B            |
| ---- | --------------------- | --------------------- |
| t1   | `SELECT stock` → 1    |                       |
| t2   |                       | `SELECT stock` → 1    |
| t3   | 재고 있음 → 재고 차감 |                       |
| t4   |                       | 재고 있음 → 재고 차감 |
| t5   | `COMMIT`              | `COMMIT`              |

일반 `SELECT`는 잠금을 걸지 않으므로 두 트랜잭션 모두 재고가 1개라고 판단합니다. 그 결과 재고 1개가 두 번 판매되고, 변경 방식에 따라 한쪽의 변경이 덮어써지거나(Lost Update) 재고가 음수가 됩니다.

`FOR UPDATE`를 걸면 B는 A가 커밋할 때까지 대기하다가 커밋 이후의 최신 값(0)을 읽습니다. 그 뒤 애플리케이션이 "재고 부족"으로 처리할 수 있습니다.

## 기본 사용법

```sql
-- 세션 A
SELECT stock FROM product WHERE id = 1 FOR UPDATE;   -- stock = 1, 행에 배타 잠금
UPDATE product SET stock = stock - 1 WHERE id = 1;
COMMIT;                                             -- 여기서 잠금 해제

-- 세션 B: A가 커밋하기 전에 실행
SELECT stock FROM product WHERE id = 1 FOR UPDATE;   -- A가 커밋할 때까지 대기
-- A가 커밋되면 최신 값(stock = 0)으로 반환됨
COMMIT;
```

MySQL은 `autocommit=1`이 기본값이라 `START TRANSACTION` 없이 실행하면 문장 하나가 트랜잭션 하나로 끝나면서 잠금이 바로 풀립니다. Oracle은 `SELECT ... FOR UPDATE`를 실행한 시점부터 트랜잭션이 시작되므로 명시적인 시작이 필요 없습니다.

## 핵심 동작

| 항목                          | 동작                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------- |
| 잠금 단위                     | `WHERE` 조건으로 선택된 행. 조인에서는 `OF` 절로 잠글 테이블을 좁힐 수 있음     |
| 잠금 유지 기간                | `COMMIT` 또는 `ROLLBACK`까지. 문장이 끝나도 풀리지 않음                         |
| 같은 행을 수정하려는 트랜잭션 | `UPDATE`·`DELETE`·`FOR UPDATE` 모두 잠금이 풀릴 때까지 대기                     |
| 일반 `SELECT`                 | 대기하지 않고 이전 버전의 데이터를 읽음 (MVCC)                                  |
| 읽는 값                       | 잠금을 얻은 시점의 최신 커밋 값. 스냅샷이 아니므로 직전 `SELECT`와 다를 수 있음 |

Oracle·InnoDB·PostgreSQL은 다중 버전 동시성(MVCC)을 쓰기 때문에 일반 `SELECT`는 행 잠금 때문에 멈추지 않습니다. 예외로 MySQL의 `SERIALIZABLE` 격리 수준은 일반 `SELECT`가 공유 잠금을 거는 조회로 바뀌어 `FOR UPDATE`를 기다립니다.

## 대기 방법: NOWAIT / WAIT / SKIP LOCKED

기본 동작은 잠금이 풀릴 때까지 기다리는 것입니다. MySQL은 `innodb_lock_wait_timeout`(기본 50초)까지만 기다립니다.

| 옵션          | 동작                                      | 어울리는 상황                              |
| ------------- | ----------------------------------------- | ------------------------------------------ |
| (생략)        | 잠금이 풀릴 때까지 대기                   | 일반적인 트랜잭션 처리                     |
| `NOWAIT`      | 잠겨 있으면 기다리지 않고 바로 오류       | 충돌 시 사용자에게 즉시 안내               |
| `WAIT n`      | 최대 n초 기다린 뒤 오류                   | 짧은 대기는 허용하되 무한정 멈추지 않게 함 |
| `SKIP LOCKED` | 잠긴 행은 건너뛰고 잠글 수 있는 행만 반환 | 여러 워커가 큐 작업을 나눠 가져갈 때       |

```sql
-- 잠겨 있으면 바로 실패
SELECT stock FROM product WHERE id = 1 FOR UPDATE NOWAIT;

-- 최대 5초만 대기 (Oracle, MariaDB)
SELECT stock FROM product WHERE id = 1 FOR UPDATE WAIT 5;

-- 작업 큐: 다른 워커가 이미 잡은 행은 건너뜀
SELECT id
FROM job_queue
WHERE status = 'WAIT'
ORDER BY id
LIMIT 10
FOR UPDATE SKIP LOCKED;
```

`SKIP LOCKED`는 잠긴 행이 결과에서 빠져도 되는 큐·배치 처리용입니다. 조회 결과가 온전해야 하는 업무 쿼리에 쓰면 행이 누락된 결과를 받게 됩니다.

## 조인과 OF 절

`FOR UPDATE`는 조인에 쓰인 모든 테이블의 행을 잠급니다. 잠금 범위가 넓으면 대기가 늘어나므로, 잠글 테이블을 `OF` 절로 지정합니다.

```sql
-- orders와 members 두 테이블의 행을 모두 잠금
SELECT o.id, o.status, m.name
FROM orders o JOIN members m ON o.member_id = m.id
WHERE o.id = 100
FOR UPDATE;

-- orders 행만 잠금 (members 행은 잠그지 않음)
-- Oracle은 컬럼으로 테이블을 지정
SELECT o.id, o.status, m.name
FROM orders o JOIN members m ON o.member_id = m.id
WHERE o.id = 100
FOR UPDATE OF o.id;

-- MySQL 8.0·PostgreSQL은 테이블(별칭)로 지정
SELECT o.id, o.status, m.name
FROM orders o JOIN members m ON o.member_id = m.id
WHERE o.id = 100
FOR UPDATE OF o;
```

| DBMS       | `OF` 절에 쓰는 값                                                                         |
| ---------- | ----------------------------------------------------------------------------------------- |
| Oracle     | 컬럼명. 잠글 테이블을 가리키는 표식일 뿐이고 실제 컬럼 이름이어야 합니다 (컬럼 별칭 불가) |
| MySQL 8.0+ | 테이블명. `SELECT`에서 별칭을 썼다면 잠금 절에서도 별칭을 써야 합니다                     |
| PostgreSQL | 테이블명 또는 별칭                                                                        |
| MySQL 5.7  | `OF` 절이 없어 조인한 모든 테이블의 행을 잠급니다                                         |

## DBMS별 차이

| 항목                             | Oracle                     | MySQL 8.0 (InnoDB)                         | PostgreSQL                          |
| -------------------------------- | -------------------------- | ------------------------------------------ | ----------------------------------- |
| 기본 대기                        | 무한 대기                  | `innodb_lock_wait_timeout`까지 (기본 50초) | 무한 대기 (`lock_timeout`으로 제한) |
| `NOWAIT`                         | 지원                       | 지원                                       | 지원                                |
| `WAIT n`                         | 지원                       | 미지원                                     | 미지원                              |
| `SKIP LOCKED`                    | 지원 (11g부터)             | 지원 (8.0부터)                             | 지원 (9.5부터)                      |
| 공유 잠금 조회                   | 없음 (`FOR UPDATE`만 제공) | `FOR SHARE` (`LOCK IN SHARE MODE`와 동일)  | `FOR SHARE`, `FOR KEY SHARE` 등     |
| 집계·`DISTINCT`·`UNION`과의 조합 | 불가 (`ORA-01786`)         | 가능 (읽은 행을 모두 잠금)                 | 불가                                |

MariaDB는 `WAIT n`·`NOWAIT`을 10.3부터, `SKIP LOCKED`를 10.6부터 지원합니다. SQL Server(T-SQL)에는 `FOR UPDATE` 구문이 없고 `SELECT ... WITH (UPDLOCK, ROWLOCK)` 힌트를 사용합니다.

| 상황           | Oracle                         | MySQL        | PostgreSQL       |
| -------------- | ------------------------------ | ------------ | ---------------- |
| `NOWAIT` 실패  | `ORA-00054`                    | `ERROR 3572` | SQLSTATE `55P03` |
| 대기 시간 초과 | `ORA-30006` (`WAIT n` 사용 시) | `ERROR 1205` | SQLSTATE `55P03` |
| 데드락         | `ORA-00060`                    | `ERROR 1213` | SQLSTATE `40P01` |

### Oracle 주의점

- **일반 `SELECT`는 잠금을 걸지 않고 대기하지도 않습니다.** 잠금은 `UPDATE`·`DELETE`·`FOR UPDATE`를 실행한 트랜잭션이 커밋할 때까지 유지되고, 대기 중인 세션은 `enq: TX - row lock contention` 대기 이벤트로 보입니다.
- **Full Table Scan이면 테이블의 모든 행을 잠급니다.** `WHERE` 조건에 맞지 않는 행도 스캔하면 잠급니다. 조건 컬럼에 인덱스가 있어야 필요한 행만 잠급니다.
- **`FOR UPDATE` 커서 루프 안에서 `COMMIT`하면 안 됩니다.** 잠금이 풀린 뒤 다음 `FETCH`에서 `ORA-01002`(fetch out of sequence)가 발생합니다. 루프가 끝난 뒤 한 번에 커밋하거나, `BULK COLLECT`로 키를 먼저 모은 뒤 나눠 처리합니다.
- **`DISTINCT`·`GROUP BY`·집계 함수·집합 연산자와 함께 쓸 수 없습니다.** (`ORA-01786`) 최상위 `SELECT`에만 쓸 수 있고 서브쿼리와 `OFFSET`/`FETCH` 절에는 쓸 수 없습니다.

```sql
-- 행 잠금을 기다리는 세션과 그 세션을 막고 있는 세션
SELECT sid, username, event, blocking_session
FROM v$session
WHERE event = 'enq: TX - row lock contention';
```

### MySQL(InnoDB) 주의점

- **트랜잭션 안에서 실행합니다.** `autocommit=1`이면 `START TRANSACTION` 없이는 문장이 끝날 때 잠금이 풀립니다.
- **인덱스가 잠금 범위를 결정합니다.** 적합한 인덱스가 없어 전체 스캔을 하면 테이블의 모든 행이 잠기고 다른 세션의 `INSERT`도 막힙니다.
- **격리 수준에 따라 범위까지 잠급니다.** REPEATABLE READ(기본값)에서는 유니크 인덱스의 등값 조건일 때만 해당 레코드만 잠그고, 범위 조건이나 비유니크 인덱스면 스캔한 범위에 갭 락·넥스트 키 락을 걸어 사이에 끼어드는 `INSERT`도 막습니다. READ COMMITTED에서는 레코드 락만 걸어 새 행이 끼어들 수 있습니다.
- **최신 커밋 값을 읽습니다.** REPEATABLE READ에서 일반 `SELECT`는 트랜잭션에서 처음 조회한 시점의 스냅샷을 읽지만 `FOR UPDATE`는 최신 값을 읽습니다. 같은 트랜잭션 안에서 두 조회의 값이 달라질 수 있습니다.
- **대기 시간 초과(`ERROR 1205`)시에는 문장만 롤백됩니다.** 트랜잭션은 열린 채로 남으므로 애플리케이션이 직접 `ROLLBACK`해야 합니다. 데드락(`ERROR 1213`)은 트랜잭션 전체가 롤백되므로 처음부터 다시 실행합니다.

```sql
-- 대기 시간은 세션 단위로 조정 (WAIT n 구문이 없음)
SET SESSION innodb_lock_wait_timeout = 5;

-- 잠금을 기다리는 트랜잭션
SELECT trx_id, trx_state, trx_started, trx_mysql_thread_id
FROM information_schema.innodb_trx
WHERE trx_state = 'LOCK WAIT';

-- 현재 잠금 목록 (8.0)
SELECT ENGINE_TRANSACTION_ID, LOCK_TYPE, LOCK_MODE, LOCK_DATA
FROM performance_schema.data_locks
WHERE OBJECT_NAME = 'product';
```

### PostgreSQL 주의점

- **`WAIT n`이 없습니다.** 대기 시간은 `SET lock_timeout = '5s';`로 제한합니다.
- **`ORDER BY`와 함께 쓰면 정렬이 어긋날 수 있습니다.** READ COMMITTED에서는 먼저 정렬한 뒤 잠금을 기다리기 때문에, 기다리는 사이 정렬 컬럼 값이 바뀌면 결과가 정렬되지 않은 채 반환될 수 있습니다.
- **잠금 강도를 고를 수 있습니다.** `FOR NO KEY UPDATE`는 외래 키 검사가 거는 공유 잠금(`FOR KEY SHARE`)과 충돌하지 않으므로, 부모 행을 잠그면서도 자식 테이블의 `INSERT`를 허용할 때 씁니다.

## 데드락

트랜잭션마다 서로 다른 순서로 여러 행을 잠그면 서로 상대의 잠금을 기다리는 교착 상태가 됩니다.

| 시각 | 트랜잭션 A                     | 트랜잭션 B                     |
| ---- | ------------------------------ | ------------------------------ |
| t1   | 1번 행 `FOR UPDATE` → 1번 잠금 |                                |
| t2   |                                | 2번 행 `FOR UPDATE` → 2번 잠금 |
| t3   | 2번 행 `FOR UPDATE` → 대기     |                                |
| t4   |                                | 1번 행 `FOR UPDATE` → 대기     |

DBMS가 교착을 감지해 한쪽 트랜잭션을 롤백하고 오류를 반환합니다. 롤백된 쪽은 트랜잭션 전체를 다시 실행해야 합니다.

1. **필요한 행은 한 문장으로 잠급니다.** `WHERE id IN (1, 2)`처럼 한 번에 잠그면 여러 문장으로 나눠 잠글 때보다 순서가 어긋날 여지가 줄어듭니다.
2. **여러 문장으로 잠글 때는 순서를 고정합니다.** 모든 트랜잭션이 같은 순서(예: PK 오름차순)로 잠급니다. `ORDER BY`만으로는 잠그는 순서가 보장된다고 볼 수 없습니다(DBMS와 실행 계획에 따라 다릅니다).
3. **트랜잭션을 짧게 유지합니다.** 잠금을 건 뒤에는 외부 API 호출처럼 오래 걸리는 작업을 하지 않습니다.
4. **대기 시간을 제한하고 재시도합니다.** `WAIT n`이나 `innodb_lock_wait_timeout`으로 멈추는 시간에 상한을 두고, 실패 시 처음부터 다시 실행합니다.

## FOR UPDATE 없이 해결하는 방법

`FOR UPDATE`는 잠금으로 처리를 직렬화하므로 충돌이 많으면 대기 시간이 늘고 처리량이 줄어듭니다. 한 문장으로 끝낼 수 있다면 그쪽이 더 간단합니다.

```sql
-- 조건부 UPDATE: 조건을 UPDATE에 넣고 반영된 행 수로 판단
UPDATE product SET stock = stock - 1
WHERE id = 1 AND stock >= 1;
-- 1행 반영: 성공, 0행 반영: 재고 부족

-- 낙관적 잠금: version 컬럼으로 변경 충돌을 검출
SELECT id, stock, version FROM product WHERE id = 1;   -- 조회 시점에는 잠금 없음
UPDATE product SET stock = stock - 1, version = version + 1
WHERE id = 1 AND version = 3;                          -- 0행이면 누군가 먼저 변경함
```

| 방식                       | 어울리는 상황                                        |
| -------------------------- | ---------------------------------------------------- |
| `FOR UPDATE` (비관적 잠금) | 읽은 값으로 분기·계산이 복잡하고 충돌이 잦을 때      |
| 조건부 `UPDATE`            | "충분하면 차감"처럼 한 문장으로 표현되는 경우        |
| 낙관적 잠금 (version 컬럼) | 충돌이 드물고 수정 화면처럼 값을 오래 들고 있는 경우 |
| `SKIP LOCKED`              | 여러 워커가 큐 작업을 나눠 가져가는 경우             |

## 애플리케이션에서 사용할 때 (Spring)

`FOR UPDATE` 조회와 이후 `UPDATE`가 **같은 트랜잭션** 안에서 실행돼야 잠금이 유지됩니다. 트랜잭션이 없으면 자동 커밋으로 실행되어 `SELECT ... FOR UPDATE` 직후 잠금이 풀립니다.

```java
@Transactional
public void decreaseStock(Long productId) {
    Product product = productMapper.selectForUpdate(productId);   // SELECT ... FOR UPDATE
    if (product.getStock() <= 0) {
        throw new IllegalStateException("재고 부족");               // RuntimeException → 롤백
    }
    productMapper.decreaseStock(productId);
}   // 정상 종료 시 COMMIT, 예외 시 ROLLBACK → 잠금 해제
```

- **자기 호출에는 트랜잭션이 걸리지 않습니다.** 같은 클래스의 다른 메서드에서 `decreaseStock`을 직접 호출하면 프록시를 거치지 않아 `@Transactional`이 적용되지 않습니다.
- **잠금을 들고 오래 기다리지 않습니다.** 트랜잭션 안에서 외부 API 호출을 하면 그동안 다른 트랜잭션이 전부 대기합니다.

## 관련 페이지

- [[summaries/database/oracle-sql]] — Oracle SQL 필수 문법
- [[concepts/java/java-exceptions]] — 예외 처리 베스트 프랙티스 (Spring 롤백 규칙)
