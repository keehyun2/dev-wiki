---
title: 이진 탐색 트리 (BST)
---

# Binary Search Tree, BST (이진 탐색 트리)

이진 트리에서는 하나의 Node 가 **1개의 key**(data) 와 **2개의 자식 node 를 가리키는 link(left,right)** 를 가지고있습니다. BST(이진 탐색 트리)는 **검색, 삽입, 삭제**은 평균 *O(log n)* 의 시간 복잡도를 가집니다. 하지만 최악의 경우 [편향이진트리](https://www.google.com/search?q=%ED%8E%B8%ED%96%A1+%EC%9D%B4%EC%A7%84%ED%8A%B8%EB%A6%AC&tbm=isch)가 생성되면 최악의 효율*O(n)*이 발생합니다. 이를 보완하고 좌우 균형을 맞추어 탐색 효율을 높일 목적으로 자가 균형 트리(self-balancing tree)인 **AVL 트리, 레드-블랙 트리** 등을 사용합니다. (데이터베이스 등에서는 다진 균형 트리인 **B-tree** 계열도 사용합니다.)

아래의 java 소스코드는 [해외 블로그](https://algorithms.tutorialhorizon.com/binary-search-tree-complete-implementation/)를 참고하였습니다. 탐색,삽입 하는 코드는 비교적 간결하고, 트리의 node 를 삭제하는 logic 은 3가지로 분류 됩니다. 

1. **삭제 node 의 자식이 없는 경우** -  node 를 바로 삭제 합니다. 

2. **삭제 node 의 자식이 1개 인 경우** - 자식 node 를 자신 대신에 부모 node 의 자식 pointer 에 연결합니다. 그 이후에 node 를 삭제 합니다. node 를 그 자식 node 로 대체한다고 보면 좋을 것 같습니다. 

3. **삭제 node 의 자식이 2개 인 경우** - left subtree 의 **최대 node** 나 right subtree 의 **최소 node** 를 가져와서 삭제할 node 를 대체 합니다. 그런데 여기서 최대 node나 최소 node 가 하나의 자식 node 를 가질 경우 그 자식 node 를 조부모 node 와 연결하는 logic(**소스코드의 getSuccessor 함수**) 이 추가되어야합니다. 

   ​

```java
public class BinarySearchTree {
	public static Node root;

	public BinarySearchTree() {
		this.root = null;
	}

	/**
	 * tree 에서 key 로 node 를 탐색합니다.
	 * @param id
	 * @return
	 */
	public boolean find(int id) {
		Node current = root;
		while (current != null) {
			if (current.data == id) {
				return true;
			} else if (current.data > id) {
				current = current.left;
			} else {
				current = current.right;
			}
		}
		return false;
	}

	/**
	 * tree 에서 key 를 찾아서 node 를 삭제합니다.
	 * @param id
	 * @return
	 */
	public boolean delete(int id) {
		Node parent = root;
		Node current = root;
		boolean isLeftChild = false;
		while (current.data != id) {
			parent = current;
			if (current.data > id) {
				isLeftChild = true;
				current = current.left;
			} else {
				isLeftChild = false;
				current = current.right;
			}
			if (current == null) {
				return false;
			}
		}
		// if i am here that means we have found the node
		// Case 1: if node to be deleted has no children
		if (current.left == null && current.right == null) {
			if (current == root) {
				root = null;
			}
			if (isLeftChild == true) {
				parent.left = null;
			} else {
				parent.right = null;
			}
		}
		// Case 2 : if node to be deleted has only one child
		else if (current.right == null) {
			if (current == root) {
				root = current.left;
			} else if (isLeftChild) {
				parent.left = current.left;
			} else {
				parent.right = current.left;
			}
		} else if (current.left == null) {
			if (current == root) {
				root = current.right;
			} else if (isLeftChild) {
				parent.left = current.right;
			} else {
				parent.right = current.right;
			}
		} else if (current.left != null && current.right != null) {

			// now we have found the minimum element in the right sub tree
			Node successor = getSuccessor(current);
			if (current == root) {
				root = successor;
			} else if (isLeftChild) {
				parent.left = successor;
			} else {
				parent.right = successor;
			}
			successor.left = current.left;
		}
		return true;
	}

	/**
	 * node 를 삭제할때 좌측 우측 sub 가 있는 경우 parameter node 의 right sub tree 에서 가장 최소 key 를 가진 node 를 반환합니다. 
	 * @param deleleNode
	 * @return 
	 */
	public Node getSuccessor(Node deleleNode) {
		Node successsor = null; // current 의 부모 node 를 pointer 로 사용
		Node successsorParent = null; // current 의 조부모 node 를 pointer 로 사용
		Node current = deleleNode.right; // 삭제 할노드의 우측 자식 노드 주소를 current pointer 에 저장
		while (current != null) { // current 값이 없을때까지 반복
			successsorParent = successsor; // current 의 조부모
			successsor = current; // current 의 부모
			current = current.left; // 좌측의 node 주소를 계속 찾음.
		}
		// check if successor has the right child, it cannot have left child for sure
		// if it does have the right child, add it to the left of successorParent.
		// successsorParent
		if (successsor != deleleNode.right) { // successsor 가  삭제 노드의 우측 자식 노드 가 아닐경우 
			successsorParent.left = successsor.right; // successsor의 우측 자식 노드를 sucessor 의 자리를 대체한다.  
			successsor.right = deleleNode.right; // successsor 의 우측 자식 노드 pointer 는 삭제될 node 의 우측 자식노드의 주소를 가르킨다.  
		}
		return successsor;
	}

	/**
	 * 이진 탐색 트리에 key 삽입합니다.
	 * @param id
	 */
	public void insert(int id) {
		Node newNode = new Node(id);
		if (root == null) {
			root = newNode;
			return;
		}
		Node current = root;
		Node parent = null;
		while (true) {
			parent = current;
			if (id < current.data) {
				current = current.left;
				if (current == null) {
					parent.left = newNode;
					return;
				}
			} else {
				current = current.right;
				if (current == null) {
					parent.right = newNode;
					return;
				}
			}
		}
	}

	/**
	 * parameter 로 전달된 node 하위의 sub tree 를 중위 순회(left-root-right)하여 print 합니다.  
	 * @param root
	 */
	public void display(Node root) {
		if (root != null) {
			display(root.left);
			System.out.print(" " + root.data);
			display(root.right);
		}
	}
}

class Node {
	int data; 
	Node left; 
	Node right;

	// constructor
	public Node(int data) {
		this.data = data;
		left = null;
		right = null;
	}
}
```



참고 문서 - [이진탐색트리(java)](https://algorithms.tutorialhorizon.com/binary-search-tree-complete-implementation/)

## 관련 페이지
- [[binary-tree]] — 트리·이진 트리 기본 개념
- [[algorithm-coding-mistakes]] — 코딩 실수 방지 패턴
