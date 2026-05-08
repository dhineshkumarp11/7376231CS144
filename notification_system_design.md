## Stage 1

**Objective:** To efficiently maintain and display the top $N$ (e.g., 10) most important unread notifications from a continuous, real-time stream of data, prioritized by category weight (Placement > Result > Event) and recency (Timestamp).

### 1. The Naive Approach (And Why to Avoid It)
The most straightforward approach to handling a new incoming notification is to push it into the existing array of all notifications and apply the standard `.sort()` method. 

* **Time Complexity:** $O(N \log N)$ every time a new notification arrives, where $N$ is the total number of notifications. 
* **Drawback:** In a real-time system where notifications arrive frequently and the historical list grows infinitely large, resorting the entire dataset for every single new event is computationally expensive and scales poorly, leading to UI thread blocking in the frontend or high CPU load on the backend.

### 2. The Optimal Approach: Size-Restricted Min-Heap (Priority Queue)
To maintain exactly the Top 10 notifications efficiently as a continuous stream flows in, the optimal data structure is a Min-Heap restricted to a maximum size of $K$ (where $K = 10$).

**How it works:**
1. **Initialization:** As the first 10 notifications arrive, they are inserted into the heap. 
2. **The Root Node:** The heap is ordered using our custom comparator (Weight first, then Timestamp). Because it is a Min-Heap, the root node will always hold the lowest priority notification currently residing in our Top 10 list.
3. **Processing New Stream Data:** When the 11th notification (and every subsequent one) arrives, we compare it in $O(1)$ time to the root node.
   * If the new notification has a lower priority than the root, it cannot be in the Top 10. We simply discard it from our priority view.
   * If the new notification has a higher priority than the root, we extract (pop) the current root and insert (push) the new notification, letting the heap re-balance itself.

### 3. Complexity Analysis
Using the size-restricted Min-Heap yields massive performance improvements for streaming data:

* **Time Complexity:** $O(\log K)$ per insertion. Since $K$ is a small constant (10), insertion effectively operates in $O(1)$ time.
* **Space Complexity:** $O(K)$. We only ever store 10 elements in memory for this specific view, regardless of whether 100 or 1,000,000 notifications have been processed.

### 4. Alternative Approach: Binary Search / Sorted Insertion
If a heap implementation is too heavy for the frontend client, an acceptable alternative for a small, fixed $K$ (like 10) is maintaining a standard sorted array of length 10 and using Binary Search for insertion.

* When a new notification arrives, we use binary search ($O(\log K)$) to find its correct index in the Top 10 array. 
* If it belongs in the array (index < 10), we splice it in and pop the last element off the array. While array shifting takes $O(K)$ time, since $K=10$, this remains highly performant and avoids touching the broader $N$ dataset.