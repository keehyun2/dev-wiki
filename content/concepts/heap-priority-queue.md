# Heap(히프)

**Heap** 은 root 가 최대값인 max-heap, 최소값인 min-heap이 있는데 다른 언급이 없으면 max-heap 을 의미합니다.  heap은 아래에서 위로 순서를 가지고 있는 이진 트리이므로 모든 leaf-root path 를 따라 가는 순회는 오름차순으로 key 를 방문합니다. 이것은 어떠한 key도 부모보다 크지 않다고 말하는 것과 같습니다. 

```java
/**
* node의 childe node를 비교하여 히프화합니다. 
* @param arr
* @param nodeIndex 히프화할 node 의 번호입니다. 
* @param heapSize 완전 이진 트리의 크기입니다.  
*/
void heapify(int[] arr, int nodeIndex, int heapSize) { 
  int ai = arr[nodeIndex]; 
  while (nodeIndex < heapSize/2) { // arr[i] 는 leaf 가 아닌경우만 loop 를 순환합니다. 
    int j = 2 * nodeIndex + 1; // j는 ai의 좌측 자식 노드의 index 입니다. 
    if(j + 1 < heapSize && arr[j + 1] > arr[j]) ++j; // 우측 자식 노드의 값이 더 큰 경우 j를 후증가합니다. 
    if(arr[j] <= ai) break; // 부모가 자식노드보다 크면 loop 를 종료합니다. 
    arr[nodeIndex] = arr[j];
    nodeIndex = j;
  }
  arr[nodeIndex] = ai;
}
```

히프화 알고리즘은 **2 * log n** 번 이상의 비교를 하지 않습니다. 히프화 알고리즘은 특정 노드를 root로 하는 서브트리에 대해 heap 특성이 만족됩니다. 가장 하위 내부 노드 부터 시작하여 root 에 이르기까지 각각의 x 에 대한 이 연산을 반복함에 의해 전체 트리를 히프화할 수 있습니다. 이러한 과정을 **히프 구축(Heap Build)** 라고 합니다. 

```java
/**
* heapify 함수를 활용하여 Heap 을 구축합니다. 
* @param arr
* @param nodeIndex
* @param heapSize
*/
void buildHeap(int[] arr, int nodeIndex, int heapSize) {
  if(nodeIndex >= heapSize/2) return;
  buildHeap(arr, 2 * nodeIndex + 1, heapSize); // buildHeap- left subTree 
  buildHeap(arr, 2 * nodeIndex + 2, heapSize); // buildHeap- right subTree
  heapify(arr, nodeIndex, heapSize);
}
```

# Priority queue(우선순위 큐)

큐는 **first-int,first-out**(선입선출) 자료구조(FIFO)로 입니다. 우선순위 큐는 **best-in, first-out**(최적입선출) 인 자료구조(BIFO)입니다. 더 작은 작업에 더 높은 우선순위를 부여합니다. 공유 프린터가 보통 이런식으로 관리됩니다. java collection framework 에서는 **java.util.PriorityQueue **클래스를 제공하고, 구현하는 방법이 여러가지이빈다. 

**방법1**. 이것이 기본형이면 간단하게 구현이 가능한데 아래는 **int** 형에 대한 우선순위 큐 사용법입니다. 

```java
PriorityQueue pq = new PriorityQueue(Collections.reverseOrder()); 
pq.offer(2);
pq.offer(1);
pq.offer(9);
pq.offer(7);
pq.offer(4);
pq.offer(8);
pq.offer(10);
pq.toString(); // [10, 7, 9, 1, 4, 2, 8]
```

이것을 객체에 사용하기 위해서는 객체들을 비교할 수 있는 방법이 있어야합니다.  

**방법2**. 비교방법 구현은 Comparable 인터페이스를 사용해야합니다. 아래는 그 예시입니다.

```java
class CustomString implements Comparable<CustomString> {
	
	public String str;
	
	public CustomString(String str) {
		this.str = str;
	}

	public int compareTo(CustomString cs) {
		int leng1 = this.str.length();
		int leng2 = cs.str.length();
		if (leng1 < leng2) return -1;
		if (leng1 > leng2) return 1;
		return this.str.compareTo(cs.str); // 길이가 같은 경우만 compareTo 사용함
	}
}
public static void main(String[] args) throws NumberFormatException, IOException {
  
    PriorityQueue<CustomString> pq = new PriorityQueue<CustomString>(); 
    pq.add(new CustomString("axcdcc"));
    pq.add(new CustomString("33"));
    pq.add(new CustomString("zsdc"));
}
```

위와 같이 **Comparable** 인터페이스의 **comparTo** 함수 내부를 구현하면됩니다. 

```java
s1.compareTo(s2) < 0 //  s1 < s2
s1.compareTo(s2) == 0 // s1 == s2
s1.compareTo(s2) > 0 // s1 > s2
```

**방법3**. **Comparator**(비교기) 를 구현하여 우선순위 큐에 전달하는 방법입니다. 

```java
import java.util.Comparator;
import java.util.PriorityQueue;

public class Test
{
    public static void main(String[] args)
    {
        Comparator<String> comparator = new StringLengthComparator();
        PriorityQueue<String> queue = 
            new PriorityQueue<String>(10, comparator);
        queue.add("short");
        queue.add("very long indeed");
        queue.add("medium");
        while (queue.size() != 0)
        {
            System.out.println(queue.remove());
        }
    }
}

// StringLengthComparator.java
import java.util.Comparator;

public class StringLengthComparator implements Comparator<String>
{
    @Override
    public int compare(String x, String y)
    {
        // Assume neither string is null. Real code should
        // probably be more robust
        // You could also just return x.length() - y.length(),
        // which would be more efficient.
        if (x.length() < y.length())
        {
            return -1;
        }
        if (x.length() > y.length())
        {
            return 1;
        }
        return 0;
    }
}
```

**Comparator** 는 **compare(Object obj1, Object obj2)** 를 구현합니다.

```java
comparator.compare(s1, s2) < 0 //  s1 < s2
comparator.compare(s1, s2) == 0 // s1 == s2
comparator.compare(s1, s2) > 0 // s1 > s2
```

PriorityQueue 인터페이스를 위한 add() 메소드는 본질적으로 **heapify** 알고리즘의 반대인 알고리즘을 사용합니다. 이것은 leaf에서 root로 tree 를 올라가며 순회합니다. 트리에 대한 모든 삽입 알고리즘과 같이, 이것도 처음에는 새로운 leaf node 로 원소를 삽입합니다. 그런 다음 이 노드와 이것보다 작은 모든 선조에 대해 회전을 수행합니다.





참고 문서 - [StackOverflow](https://stackoverflow.com/questions/683041/how-do-i-use-a-priorityqueue)
## 관련 페이지
- [[sorting-algorithms]] — 힙 정렬 포함 정렬 알고리즘 총정리
- [[linked-list-stack-queue]] — 연결리스트, 스택, 큐
