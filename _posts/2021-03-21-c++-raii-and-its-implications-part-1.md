---
title: "C++ RAII and its implications: Part 1"
tags: [C++, Language]
style: border
color: primary
description: I dive into the RAII paradigm while discussing solutions to issues with dynamic memory allocation. 
---

## Inspiration

The inspiration to write this post was a course on Pluralsight for modern C++ 17, where I heard a comment from the instructor discouraging the use of `new`.
This led me down a rabit hole, allowing me to discover cool features of modern C++ I had no idea about, in my pursuit of writing readable and efficient code.

By discouraging the use of `new`, the instructor was indirectly encouraging the use of one memory allocation paradigm over another.
In other words, use **automatic memory allocation** (on the stack) instead of **dynamic memory allocation** (in the heap). There are many reasons for this,
some are obvious, while others, not so much. I'll first give some context before diving in.

## The Stack

The stack allocates memory in a layered fashion. The consequence of this is that you know exactly what and how much is allocated for each scope.
This is the memory allocation technique for local variables in many programming languages. It is extremely fast because it requires minimal bookkeeping. The
address range for deallocation when leaving a scope is implicit, and so is the starting address to allocate when entering a scope.

In C++, this is called **automatic storage** because the storage is claimed automatically at the end of scope.
Memory for all variables in the scope (delimited by `{}`) is automatically collected.
This is also the moment where destructors are invoked on every object in the scope to clean up resources.

## The Heap
The reason you would allocate memory in the heap instead of on the stack is for flexibility.
Bookkeeping is more complex and allocation is slower. Because there is no implicit release point, you must release the memory manually, 
using `delete` (`free` in C). However, the absence of an implicit release point is the key to the flexibility when using heap.

Even though using the heap is slower and opens the door to possible memory leaks or memory fragmentation, there are perfectly good use cases for dynamic allocation, 
as it's less limited.

### Two key reasons to use dynamic allocation:

* You don't know how much memory you need at compile time. For instance, when reading a text file into a string, you usually don't know what size the file has, 
so you can't decide how much memory to allocate until you run the program.

* You want to allocate memory which will persist after leaving the current scope. For instance, you may want to write a function `std::string readfile(std::string filename)` 
that returns the contents of a file. In this case, even if the stack could hold the entire file contents, you could not return from a 
function and keep the allocated memory block.

Compared to other languages, dynamic allocation by **you** in C++ is often unnecessary. C++ has a neat construct called a destructor, which is a mechanism that 
allows you to manage resources by aligning the lifetime of the resource with the lifetime of a variable. 
This technique is called RAII [(Resource Acquisition Is Initialization)](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) and is a huge
upside in using C++. In other words, we are removing the necessity to use the first reason to use dynamic allocation above, by making it not the code writer's 
problem. Objects "wrap" resources within them. `std::string` is a perfect example. Observe the following code:
```c++
int main(int argc, char* argv[]) {
    std::string s(argv[0]);
}
```
Wait a minute, we're actually allocating a variable amount of memory here, as the string to be stored in `s` is an input to the program. How? well, 
the `std::string` object allocates memory using the heap in its constructor and releases it in its destructor. The destructor is automatically invoked
when we are about to leave the scope where the variable `s` exists.
In this case, you did not need to manually manage any resources for `s` and still got the benefits of dynamic memory allocation.

In other words, doing the following is bad practice:

```c++
int main(int argc, char* argv[]) {
    std::string *s = new std::string(argv[0]);
    delete s;
}
```
While it behaves identically to the previous snippet, there is more typing and you are unecessarily introducing the risk of forgetting to deallocate memory. 
It does this with no apparent benefit. Objects created by `new` must be eventually deleted else they leak. The destructor won't be called, memory won't be freed.

To sum up the benefits of the approach (automatic allocation with RAII):

* Faster to type
* Faster to run because you no longer need a garbage collector (which C++ does not have)
* Less prone to memory/resource leaks.
* And a nuanced reason, consider the following code:

```c++
class Box {
public:
    Box();		// Constructor
    ~Box();		// Destructor
    std::string* mItem;
};

Box::Box() {
    mItem = new std::string("toy_car");
}

Box::~Box() {
    delete mItem;
}
```
This is actually problematic in C++, the reason being that `std::string` properly defines a copy constructor. Consider what happens with the following code:
```c++
int main() {
    Box b1;
    Box b2 = b1;
}
```
When exiting the `main()` function, the destructor for both `b1` and `b2` are called, but `b1` and `b2` will point to the same `std:string` in the heap. This will lead to 
delete being called on the same `std:string` twice, causing the program to crash. The remedy is simple:
```c++
class Box {
public:
    Box();
    std::string mItem;
};

Box::Box() {
    mItem = "toy_car";
}
```
Just let the `std:string` manage its own memory. Whenever an object is about to be destructed, it will automatically call the destructors
of all its member variables. This creates an automatic chain of destruction, where you don't need to manage any memory, as long as you are using modern
C++ containers like `std:string`, `std:vector`, etc. Every parent in the hierarchy will destruct its children. Basically, it's better than the sum of its parts. 
The whole mechanism composes. It scales elegantly.

```c++
class Warehouse{
    Box boxes[4];	// Using the Box class from before
};

int main() {
    Warehouse warehouse;
}
```
allocates four `std::string` instances, four `Box` instances, one `Warehouse` instance and all the `std:string`'s contents and everything is freed automacically.

Extensive use of RAII is considered a best practice in C++ because of all the reasons above.

Now that we've disbanded the first reason to use dynamic allocation, what can we do about the second reason?

## Smart Pointers

As opposed to using raw pointers if we need a resource in a different scope and we are having to deal with the aformentioned problems with dynamic memory
allocation, smart pointers like `std::unique_ptr`, `std::shared_ptr` solve the dangling reference problem in the absence of a garbage collector, 
but they require coding discipline and have other potential issues (like copyability and reference cycles, however the latter can be overcome with 
the use of `std::weak_ptr`).

Using Smart Pointers, we can make pointers work in such a way that we don’t need to explicitly call delete. A smart pointer is a wrapper class over a pointer 
with operators like `*` and `->` overloaded. The objects of smart pointer class look like a pointer but can do many things that a normal pointer can’t, 
like automatic destruction, reference counting and more.

### Types of Smart Pointer

* `std::unique_ptr`: It allows only one pointer to some memory in the heap (or an object). It does this by overloading the copy and assignment operator constructors. The only way
you can shift this pointer is by using the move constructor. The raw pointer it wraps is deallocated when the `std::unique_ptr` gets assigned a different `std::unique_ptr` or 
it moves out of scope (destructed). 
(move constructor and move semantics are discussed in detail in part 2, for now, just know that
when you move a pointer from one variable to another, the original variable will point to nullptr, and the new variable will now point to what the original
variable was originally pointing to).
```c++
#include <memory>
using namespace std;
int main() {
    std::unique_ptr<Box> b1;
    std::unique_ptr<Box> b2;
    b1 = b2;    // Fails
    b1 = std::move(b2);     // b1 will point to what b2 was pointing to, b2 points to null
    cout << b1->mItem << endl;
}
```

* `std::shared_ptr`: Allows more than one pointer to point to some memory in heap (or an object) at a time. It maintains a reference counter, which counts how many
`std::shared_ptr` point to this object/memory. Destructing the `std::shared_ptr` at the end of a scope reduces the reference count. 
The raw pointer it wraps is deallocated when the reference count reaches 0. It does this by overloading the copy and assignment operator constructors, 
having a raw refCount pointer
which is an unsigned int, which gets copied over to any new `std::shared_ptr` being created by the copy and assignment constructors. You can call `use_count()`
on a `std::shared_ptr` to get the number of `std::shared_ptr` pointing to the same underlying memory.

```c++
#include <memory>

int main() {
    std::shared_ptr<Box> b1;
    std::shared_ptr<Box> b2;
    b1 = b2;    // Succeeds, b1.use_count() returns 2, so does b2.use_count() 
}
```

* `std::weak_ptr`: Consider the following situation:

```c++
#include <memory>

class Box {
public:
    std::shared_ptr<Box> m;
}

int main() {
    std::shared_ptr<Box> A;
    std::shared_ptr<Box> B;
    A->m = B;
    B->m = A;
}
```
Here, we have a `std::shared_ptr` that contains a `std::shared_ptr` that points to another `std::shared_ptr`, and vice versa. This forms a reference cycle, and leaving the `main()`
function scope does not destruct the objects pointed to by `A` or `B`. This is because their reference counts never reach 0.

`std::weak_ptr` was designed to solve the "cyclical ownership" problem described above. A `std::weak_ptr` is an observer, it can observe and access the same object as a 
`std::shared_ptr` (or other `std::weak_ptr`'s), but it is not considered an owner. 
Remember, when a shared pointer goes out of scope, it only considers whether other `std::shared_ptr` are co-owning the object. `std::weak_ptr` does not count towards the
`std::shared_ptr` reference count.

We can fix the above code snippet as follows:
```c++
#include <memory>

class Box {
public:
    std::weak_ptr<Box> m;
}

int main() {
    std::shared_ptr<Box> A;
    std::shared_ptr<Box> B;
    A->m = B;
    B->m = A;
}
```
The internal references to each other now no longer count towards the `std::shared_ptr` reference count, and hence `A` and `B` will successfully destruct on leaving 
the scope.

The downside of `std::weak_ptr` is that `std::weak_ptr` are not directly usable (they have no `->` operator). 
To use a `std::weak_ptr`, you must first convert it into a `std::shared_ptr`, then you can use the `std::shared_ptr`. 
To convert a `std::weak_ptr` into a `std::shared_ptr`, you can use the `lock()` member function. Here’s the above code snippet, updated to show this off:
```c++
#include <memory>

class Box {
public:
    std::weak_ptr<Box> m;
}

int main() {
    std::shared_ptr<Box> A;
    std::shared_ptr<Box> B;
    A->m = B;
    B->m = A;

    std::shared_ptr<Box> C = A->m.lock();
    // C is basically B, and can be dereferenced using ->
}
```

In a nutshell, `std::shared_ptr` can be used when you need multiple smart pointers that can co-own a resource. 
The resource will be deallocated when the last `std::shared_ptr` goes out of scope. 
`std::weak_ptr` can be used when you want a smart pointer that can see and use a shared resource, but does not participate in the ownership of that resource.


[Continued in Part 2](/blog/c++-raii-and-its-implications-part-2)
