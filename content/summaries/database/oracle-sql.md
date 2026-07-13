# Oracle SQL 필수 문법

## DDL (데이터 정의)

```sql
CREATE TABLE employees (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100),
    salary NUMBER
);

ALTER TABLE employees ADD department_id NUMBER;
ALTER TABLE employees MODIFY salary NUMBER(10,2);
DROP TABLE employees;
```

## 고급 조회

### 분석 함수

```sql
-- 행 번호
SELECT ROW_NUMBER() OVER (ORDER BY salary DESC) as rank,
       name, salary
FROM employees;

-- 누적 합계
SELECT name, salary,
       SUM(salary) OVER (ORDER BY id) as cumulative_salary
FROM employees;
```

### WITH 절 (CTE)

```sql
WITH dept_avg AS (
    SELECT department_id, AVG(salary) as avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT e.name, e.salary, d.avg_salary
FROM employees e
JOIN dept_avg d ON e.department_id = d.department_id;
```

### MERGE (Upsert)

```sql
MERGE INTO employees e
USING new_data n ON (e.id = n.id)
WHEN MATCHED THEN
    UPDATE SET e.salary = n.salary
WHEN NOT MATCHED THEN
    INSERT (id, name, salary) VALUES (n.id, n.name, n.salary);
```

### CONNECT BY (계층적 조회)

```sql
-- 상위-하위 관계 조회
SELECT level, employee_id, name, manager_id
FROM employees
CONNECT BY PRIOR employee_id = manager_id
START WITH manager_id IS NULL;
```

### LISTAGG (행 집계)

```sql
SELECT department_id,
       LISTAGG(name, ', ') WITHIN GROUP (ORDER BY name) as employees
FROM employees
GROUP BY department_id;
```

## 날짜 함수

```sql
SYSDATE                    -- 현재 날짜/시간
ADD_MONTHS(SYSDATE, 3)     -- 3개월 후
TRUNC(SYSDATE)            -- 날짜만 (시간 제거)
LAST_DAY(SYSDATE)         -- 말일
MONTHS_BETWEEN(date1, date2) -- 개월 차이
```

### 날짜 포맷

```sql
TO_DATE('2024-01-01', 'YYYY-MM-DD')
TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')
TO_CHAR(SYSDATE, 'YYYY"년" MM"월" DD"일"')
```

## 자주 쓰는 패턴

### 중복 제거

```sql
DELETE FROM employees e
WHERE ROWID > (
    SELECT MIN(ROWID)
    FROM employees e2
    WHERE e.id = e2.id
);
```

### TOP N

```sql
SELECT * FROM (
    SELECT e.*, ROWNUM as rn
    FROM employees e
    ORDER BY salary DESC
)
WHERE rn <= 10;
```

## 관련 페이지

- [[sources/developers-cheatsheet.md]] - 전체 개발자 치트시트
