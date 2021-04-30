---
title: "C++ RAII and its implications: Part 2"
tags: [C++, Language]
style: border
color: primary
description: Next up, move semantics for STL containers and exception handling (stack unwinding). 
---

## Move semantics

Using the RAII paradigm in C++ has even more benefits. In addition to constructors and destructors, C++ objects also have copy constructors, 
move constructors and operator constructors.

Here are how they can be defined:
```c++
class Box {
public:
	Box() {
		// Constructor
	}

	~Box() {
		// Destructor
	}

	<return_type> operator=(const Box &b) {
		/* Assignment operator constructor
		invoked when an already initialised object is assigned another object.
		eg:
		Box b1, b2;
		b1 = b2;
		same as doing: b1.operator=(b2);
		return_type can be void for pure unary operators (b++;), 
		can be the class type for unary and expression (a = b++;),
		and can be reference to class type, you can do so by putting Box& as
		<return_type>, and doing: b1 = b2; would make b1 point to the same
		object as b2
		*/
	}
	
	Box(const Box &b) {
		/* Copy constructor
		invoked when an unitialised object is assigned another object.
		eg:
		Box b2;
		Box b1 = b2;
		same as doing: Box b1(b2);
		*/
	}

	Box(Box &&b) {
		/* Move constructor
		Invoked when you do:
		Box b;
		Box a = std::move(b);
		std::move() returns an rvalue (&&) of b
		same as doing: Box a(std::move(b));
		This type of constructor steals resources
		from the passed in object, either by calling
		std::move() on member variables of the object,
		or be assigning them to variables of this
		object, and setting them to default values
		in the passed object (so that the destructor
		for the passed object doesn't deallocate the
		moved resources)
		*/
	}
}
```

Modern C++ and the STL library defined elegant containers like `std::string` and `std::vector`, etc. that can very efficienty perform
operations that involve shifting around their elements.

Traditionally, without having RAII and therefore without a move constructors and destructors, any operation than involved shifting elements around
(say due to sorting, or increasing the container size because it is full) would involve having to copy the elements over into a new memory location.

This can get very expensive, consider a `std::string`, it can contain a huge number of `char`, and if a vector of strings needs to be resized,
memory for a new larger vector would need to be allocated elsewhere, and **every** existing `std::string` would need to be copied over to the new
location, which includes copying **every** `char` in every `std::string`.

With move semantics, which are a consequential benefit of RAII, when resizing the same vector, instead of copying every `char` in every `std::string` over,
we can move (steal) the resources from the `std::string` from the original vector. The `char` collection within a `std::string` is stored somewhere
in memory right? Why don't we just copy over just the pointer to this memory into the new `std::string` in the newly allocated vector? That is
exactly what the move constructor does.

As you can imagine, this scales very well, say you have a container of a container of a container. Each outer container can call the move constructors
of the inner containers, and so on, until the primitive data types or pointers are encountered, which are copied over. The container that had its
resources moved? We don't need to care about it. After moving, its resources are set to their defaults, and when it goes out of scope, it will get destructed
automacically.

This is the reason why STL containers are so fast, and why you should always use them instead of writing your own container from scratch whenever possible.
You get this massive speed up, without writing any additonal code whatsoever.


## Exception Handling in C++

With the core principles of RAII out of the way, we can begin to get into some of the differences between C++ and other languages, and the rationale behind them.

The general structure of the try-catch paradigm in C++ is similar to other languages, with one notable difference, C++ does not have a finally clause.

Following is the general syntax of try-catch in C++. Similar to other languages, if multiple catch clauses are defined, they must be arranged from most specific to most general. Always capture exceptions through reference, and not by value. This is because if you capture a derived exception into a base exception variable, the additional details from the derived exception are sliced out. You might as well get all the details of the exception being thrown, as it is anyway faster to pass
by reference. 

```c++
#include <exception>
using std::exception

class Risk{
public:
	double chance;
	bool explode;
	Risk() : chance(0.0), explode(false) {}
	Risk(double c) : chance(c), explode(false){
		if(chance >= 70.0 && chance <= 100.0)
			explode = true;
	}
	void risky() {
		if(explode)
			throw exception("Object exploded");
		else if(chance >= 0.0 && chance < 70.0)
			cout << "Did not explode!" << endl;
		else
			throw out_of_range("Chance out of range");
	}
}

try {
	// risky stuff
	Risk r(74.0);
	r.risky();
	cout << "This isn't run because previous line throws exception" << endl;
}
catch(out_of_range &oor){
	// handle specific exception
	cout << oor.what() << endl;
}
catch(exception &e){
	// handle general exception
	cout << e.what() << endl;
}
```

While C++ allows you to throw and catch anything (including `int`, `std::string`, etc), it is not the best practice to do so. We should be using the exception class hierarchy, and derive our own exceptions only when an existing exception doesn't meet our requirement.

The main derived classes of exception are:
* logic_error
* runtime_error

### Stack Unwinding

I stated previously that C++ does not have a finally clause. How come? where 
do you perform cleanup and release resources? Well, thats where the power of RAII comes in. When an exception is thrown, you will **always** leave the current scope. The current 
scope may be the try block itself, or it bubbles up to higher and higher scopes, until it encounters a try block, or it crashes the program if it tries to bubble up from main. If caught, the catch block's local variables are also destructed when leaving the catch block scope. It's effortless, elegant, and showcases the power of RAII.

As previously discussed, when exiting the scope, all variables defined in that scope have their destructors called, thereby deallocating their memory. Hence why C++ does not have, nor does it need a finally clause.

### Cost of using Exceptions

There is little to no cost to set up a try-catch if an exception is not thrown. However, if exceptions are thrown, time is used up (much more than `if` statements). It is hence recommended to use exceptions judiciously, and not just enclose everything in a try-catch. If you can predict and take care of certain situations without using exceptions, like form validation as an example, do so.

Exceptions are more useful with a deep calling hierarchy. Instead of checking the response of each function from the call stack for errors, exceptions automatically bubble up to where they can be caught and handled, saving you a bunch of checking.

For performance improvements, you can mark a function as `noexcept`, which will give you a slight performance improvement, and improves readability by indicating that a function wont throw any exception. Infact, you can even mark a function as `noexcept(false)` to indicate that a function might throw an exception.

However, this is not checked by the compiler. If you mark a function as `noexcept`, and it throws an exception, your program will most likely crash.

Using `noexcept` in certain situations, can dramatically improve performance. For example, say you are resizing a vector, and as a part of that, you are moving elements from the smaller to bigger vector. Say one of the moves threw an exception. Yes, the vector will try to undo the resizing, but it can't guarantee that it will undo everything, especially things that happened within that move operation before the exception was thrown. As a result, in the standard library, most of the operations that use move semantics, will only use them, if whatever object you use has the move constructor marked as `noexcept`. If not, they will resort to copying, which will be significantly slower.

## Conclusion

I hope you learnt some stuff while reading through these two parts, or at least you got a better understanding of the rationale between some of the design decisions behind C++.

C++ is constantly evolving and changing with every new version, simplifying tedious tasks, and improving code readability and performance. It is my personal favourate programming language.






