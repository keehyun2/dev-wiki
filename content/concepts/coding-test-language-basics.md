# 코딩 테스트 언어별 기본 문법 (입출력, 반복문, 조건문)

같은 문제를 c, c++, java, python, c#, nodejs 로 각각 푼 예제 모음입니다. 언어별 입출력 방식과 반복문·조건문 차이를 한눈에 비교할 수 있습니다.

## 언어별 입출력 — 두 정수의 합

2개 정수를 입력 받고 이를 합하여 콘솔에 출력하는 코드입니다.

### c

```c
#define _CRT_SECURE_NO_WARNINGS    // scanf 보안 경고로 인한 컴파일 에러 방지
#include <stdio.h>

int main()
{
    int a, b;
    scanf("%d %d", &a, &b);    // 표준 입력을 받아서 변수에 저장
    printf("%d\n", a + b);    // 변수의 내용을 출력
    return 0;
}
```

### c++

```c++
#include <iostream>
#include <string>
using namespace std;

int main()
{
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
}
```

### java

```java
import java.util.*;

public class Main{
    public static void main(String args[]){
        Scanner sc = new Scanner(System.in);
        System.out.println(sc.nextInt() + sc.nextInt()); // 입력받은 변수를 저장없이 바로 출력
    }
}
```

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main{
    public static void main(String args[]) throws IOException{
        // readline 을 사용하려면 예외처리가 필요하다.
        // BufferedReader가 Scanner 보다 입력 받는게 빠르다. ms 단위에서...
        // 알고리즘 문제에서 실행시간 줄이기 위해 많이 쓰는 방법이다.
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine().trim());
        System.out.println(Integer.parseInt(st.nextToken()) + Integer.parseInt(st.nextToken()));
    }
}
```

### python

```python
a = input().split()
print(int(a[0]) + int(a[1]))
```

### c#

```c#
using System;

namespace C_sharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] str = Console.ReadLine().Split();
            Console.WriteLine(int.Parse(str[0]) + int.Parse(str[1]));
        }
    }
}
```

### nodejs

```javascript
var fs = require('fs');
var input = fs.readFileSync('/dev/stdin').toString().split(' ');
// window OS - C:\dev\stdin 파일을 만들고 입력 값을 미리 저장해야 합니다
console.log(input[0] + input[1]);
```

## 언어별 반복문·조건문 — 역삼각형 별 찍기

정수 N을 입력받고 그 갯수만큼 우측에 붙은 역삼각형을 출력하는 예제입니다.

입력 : 5

```
*****
 ****
  ***
   **
    *
```

### c

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main()
{
    int N = 0;
    scanf("%d", &N);

    for (int i = 0; i < N; i++)
    {
        for (int j = 0; j < N; j++)
        {
            if (i > j)
            {
                printf(" ");
            }
            else
            {
                printf("*");
            }
        }
        printf("\n");
    }

    return 0;
}
```

### c++

```c++
#include <iostream>
#include <string>
using namespace std;

int main()
{
    int N = 0;
    cin >> N;
    for (int i = 0; i < N; i++)
    {
        for (int j = 0; j < N; j++)
        {
            if (i > j)
            {
                cout << " ";
            }
            else
            {
                cout << "*";
            }
        }
        cout << endl;
    }
}
```

### java

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main{
    public static void main(String args[]) throws NumberFormatException, IOException{

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        final int N = Integer.parseInt(br.readLine());

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N ; j++) {
                if (j < i) {
                    sb.append(" ");
                } else {
                    sb.append("*");
                }
            }
            sb.append("\n");
        }
        System.out.println(sb);
    }
}
```

### python

```python
N = int(input())
str = ''
for i in range(0, N):
    for j in range(0, N):
        if i > j:
            str += " "
        else:
            str += "*"
    str += "\n"
print(str)
```

### c#

```c#
using System;
using System.Text;

namespace C_sharp
{
    class Program
    {
        static void Main(string[] args)
        {
            int N = int.Parse(Console.ReadLine());

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < N; i++)
            {
                for (int j = 0; j < N; j++)
                {
                    if (i > j)
                    {
                        sb.Append(" ");
                    }
                    else
                    {
                        sb.Append("*");
                    }
                }
                sb.Append("\n");
            }

            Console.WriteLine(sb);
        }
    }
}
```

### nodejs

```javascript
var fs = require('fs');
var N = Number(fs.readFileSync('/dev/stdin'));
// window OS - C:\dev\stdin 파일을 만들고 입력 값을 미리 저장해야함...
var str = '';
for (var i = 0; i < N; i++) {
    for (var j = 0; j < N ; j++) {
        if (j < i) {
            str += ' ';
        } else {
            str += '*';
        }
    }
    str += '\n';
}
console.log(str);
```

## 관련 페이지
- [[algorithm-coding-mistakes]] — 코딩 실수 방지 패턴
- [[gcd-lcm-euclidean]] — 유클리드 호제법 (gcd/lcm)
