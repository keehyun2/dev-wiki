---
title: 최대공약수·최소공배수 (유클리드 호제법)
---

# 최대공약수·최소공배수 (유클리드 호제법)

## 유클리드 호제법

2개의 수의 최대 공약수를 계산할 때 큰 수(a)를 작은 수(b)로 나누고, 나머지(r)가 0이 아니면 **나누었던 수(b)**를 나머지(r)로 다시 나누고 **나머지**가 0이 될때까지 반복합니다. 반복하다가 나머지가 0이 될때 나눈 수가 최대 공약수가 됩니다.

예를 들어 78696과 19332의 최대공약수를 구하면,

```
    78696 ＝ 19332×4 ＋ 1368
    19332 ＝ 1368×14 ＋ 180
     1368 ＝ 180×7 ＋ 108
      180 ＝ 108×1 + 72
      108 ＝ 72×1 ＋ 36
       72 ＝ 36×2
```

36이 최대 공약수입니다.

## 최대 공약수 (gcd, greatest common divisor)

**최대 공약수**를 계산하는 여러가지 방법이 있겠지만 유클리드 호제법을 사용하여 계산하는 것이 코드도 간결하고, 성능도 뛰어납니다. 아래는 a와 b의 최대공약수를 계산하는 소스코드입니다.

```c++
int gcd(int a, int b)
{
    return (a % b == 0 ? b : gcd(b, a % b));
}
```

a를 b로 modular 연산(나머지 연산)한 결과가 0이면 b를 반환하고 함수가 종료되며, 그렇지 않을 경우 **나눈 수(b)**와 **나머지(a%b)**를 parameter로 gcd function을 재귀호출합니다.

## 최소 공배수 (lcm, least common multiple)

a와 b의 최소 공배수 계산은 위에서 구한 gcd로 계산할 수 있습니다.

```c++
a * b = 최대 공약수(gcd) * 최소 공배수(lcm)
a * b / 최대 공약수(gcd) = 최소 공배수(lcm)
```

```c++
int lcm(int a, int b)
{
    return a * b / gcd(a, b);
}
```

`a * b` 를 먼저 계산하면 오버플로가 발생할 수 있으므로, 범위가 큰 경우 아래처럼 gcd로 나눈 뒤 곱하는 것이 안전합니다.

```c++
int lcm(int a, int b)
{
    return a / gcd(a, b) * b;
}
```

참고 문서 - [유클리드 호제법](https://ko.wikipedia.org/wiki/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C_%ED%98%B8%EC%A0%9C%EB%B2%95), [최대공약수](https://ko.wikipedia.org/wiki/%EC%B5%9C%EB%8C%80%EA%B3%B5%EC%95%BD%EC%88%98), [최소공배수](https://ko.wikipedia.org/wiki/%EC%B5%9C%EC%86%8C%EA%B3%B5%EB%B0%B0%EC%88%98)

## 관련 페이지
- [[bitmask]] — 비트마스크 기법
- [[coding-test-language-basics]] — 언어별 입출력·반복문 비교
