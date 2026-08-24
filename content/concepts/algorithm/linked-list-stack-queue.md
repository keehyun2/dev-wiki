---
title: 연결리스트 · 스택 · 큐
---

# Linked List(연결리스트)

선형 자료구조(list)는 배열로 구현하는 방법과 여러 객체(Node) 생성하고, 포인터로 연결하여 구현하는 방법이 있습니다.  신속한 **삽입**과 **삭제**를 허용하는 순서 리스트를 유지해야 할 경우에는 후자의 방법으로 리스트를 구현하고, 이것을 연결리스트라 합니다. 

#### Node class(list의 각 항목)

```java
class Node {
    public int data;
    public Node next;
    Node (int data){ // 생성자
        this.data = data;
    }
    Node (int data,Node next){ // 2번째 생성자
        this.data = data;
        this.next = next;
    }
}
```

Node 클래스는 자기 참조(self) 형태입니다. 하나의 node 는 data 와 Node 객체를 참조하는 주소를 가질 수 있습니다. 참조의 실제값은 그것이 참조하는 객체의 메모리 주소라는 것에 유의합니다. (pointer) 또한, null 참조변수에 저장되는 메모리 주소는 0x0(16진수 값 0)입니다. 

 #### Node 삽입

```java
Node insert(Node start, int x) {
    // 전제조건 : list는 오름차순으로 정렬되어있다.
    if(start == null || start.data > x) {
        start = new Node(x,start);
        return start;
    }
    Node p = start;
    while (p.next != null) {
        if(p.next.data > x) break;
        p = p.next;
    }
    p.next = new Node(x,p.next);
    return start;
}
```

#### Node 제거

```java
Node delete(Node start, int x) {
    // 리스트가 오름차순 정렬되어있다. 
    if(start == null || start.data > x) return start;
    if(start.data == x) return start.next;

    for (Node p = start; p.next != null; p = p.next) {
        if(p.next.data > x) break; // x is not in the list
        if(p.next.data == x) {
            p.next = p.next.next; // delete it
            break;
        }
    }
    return start;
}
```

#### 연결리스트 Class 구현

```java
public class LinkedList {
	
	private Node start;

	public static class Node {
	    public int data;
	    public Node next;
	    Node (int data){ // 생성자
	        this.data = data;
	    }
	    Node (int data,Node next){ // 생성자
	        this.data = data;
	        this.next = next;
	    }
	}
	
	Node insert(Node start, int x) {
		// 리스트가 오름차순 정렬되어있다. 
		if(start == null || start.data > x) {
			start = new Node(x,start);
			return start;
		}
		Node p = start;
		while (p.next != null) {
			if(p.next.data > x) break;
			p = p.next;
		}
		p.next = new Node(x,p.next);
		return start;
	}
	
	Node delete(Node start, int x) {
		// 리스트가 오름차순 정렬되어있다. 
		if(start == null || start.data > x) return start;
		if(start.data == x) return start.next;
		
		for (Node p = start; p.next != null; p = p.next) {
			if(p.next.data > x) break; // x is not in the list
			if(p.next.data == x) {
				p.next = p.next.next; // delete it
				break;
			}
		}
		return start;
	}
	
}
```



#### 연결리스트의 특징

1. 리스트 항목 사이에 삽입은 2개의 포인터의 변경만으로 필요합니다. O(1)
2. 리스트의 맨 앞에 대한 삽입은 빈 헤드노드를 사용하지 않는 한 별도의 단계를 필요로 합니다. 
3. 삭제는 1개의 포인터의 변경으로 가능합니다. O(1)
4. 이러한 연결리스트로 임의의 긴정수를 표현, 조작할 수 있습니다. (long type(64bit) 를 초과하는 정수형을 구현할수 있습니다.)
5. 단점 - 배열에 비하여 요소에 접근하는데 시간이 걸립니다. 
6. 단점 - 포인터로 인해 메모리 공간이 낭비됩니다. 
7. 배열은 크기가 고정적이지만 연결리스트는 크기가 유동적입니다. (동적배열은 제외입니다.)




# Stack

**후입선출(LIFO: Last-In, First-Out)** 구조의 자료구조입니다. 이 구조에서 접근 가능한 유일한 객체는 가장 최근에 삽입된 객체입니다. 목록의 중간에 있는 요소들에 접근하여 작업하는 일 없이, 배열보다는 **연결리스트**로 구현하는게 더 효율적입니다. 

아래는 스택의 Abstract Data Type(ADT) 입니다. 

1. **Peek** : top의 원소를 return 합니다.
2. **Pop** : top의 원소를 삭제해서 return 합니다.
3. **Push** : 주어진 원소를 스택의 top에 추가합니다.
4. **Size** : 스택에 있는 원소의 수를 반환합니다.

### 활용(스택)

**백트래킹**을 관리하기 위한 stack 의 사용은 **게임** 플레이나 이성적인 사유의 일반화된 모델링에서 흔히 사용되는 전략입니다. 일반적으로 두뇌에서 **시행착오 전략**이 이와 같은 방법을 사용하고 있음은 명확합니다. 

java 에서는 CollectionFramework 에서 제공하는 **java.util.Deque** 인터페이스와 그 구현체 **java.util.ArrayDeque** 를 이용하여 stack 을 사용합니다. (java.util.Stack 은 설계가 오래되어 Deque 사용이 권장됩니다.)

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);    // push
stack.pop();      // pop (마지막에 넣은 원소)
stack.peek();     // peek
```



# Queue

**선입선출(FIFO: First-In, First-Out)** 을 표현하는 자료구조입니다. 삽입은 항상 큐의 뒤(back or rear)에서 수행되고, 제거는 항상 앞(front)에서 진행됩니다. 큐도 배열보다는 **연결리스트**로 구현하는게 더 효율적입니다.  

아래는 큐의 ADT 입니다. 

1. **Add** : 주어진 원소를 큐의 뒤에 삽입합니다.
2. **First** : 큐가 공백이 아니면, 큐의 앞에 있는 원소를 반환합니다.
3. **Remove** : 큐가 공백이 아니면, 큐의 앞에 있는 원소를 삭제해서 반환합니다.
4. **Size** : 큐에 있는 원소의 수를 반환합니다.

### 활용(큐)

큐의 활용은 프린터 출력 처럼 들어온 작업 순서대로 처리하거나, 그래프 탐색등에서 사용할 수 있습니다. 

java 에서는 CollectionFramework 에서 제공하는 **java.util.Queue** 인터페이스와 그 구현체 **java.util.LinkedList** 를 이용하여 queue를 사용합니다.



#### 참고 - 배열로 List를 구현한 경우 삽입과 삭제

 n개의 원소를 가진 정렬된 배열에 대한 삽입은 평균적으로 n/2 개의 원소를 이동시킵니다. 삭제도 마찬가지입니다. O(n) 



#### 참고 - Object toString() 재정의

생선된 객체를 System.out.print(object) 했을시 참조하고 있는 객체의 주소가 나타나는데, 최상위 부모 class인 **Object class**  의 toString 함수를 **override** 해서 변경할 수 있습니다. 

```java
class Node {
    public int data;
    public Node next;
    
    Node(int data){
        this.data = data;
    }
    
    @Override
    public String toString(){
        return String.valueOf(this.data);
    }
}
...
System.out.print(new Node(1)); // 1이 출력
```

위와 같이 toString() 을 재정의하여 node 객체의 data 를 바로 출력할 수 있습니다.

## 관련 페이지
- [[binary-tree]] — 트리·이진 트리 기본 개념
- [[coding-test-language-basics]] — 언어별 입출력·반복문 비교
