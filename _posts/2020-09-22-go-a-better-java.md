---
title: "Go: A Better Java"
tags: [Go, Language, Dev Logs]
style: border
color: primary
description: Part 1 of my experience with learning and using GoLang, the general purpose programming language by Google.
---

## What led me here

Well, I decided to take the opportunity bestowed upon me by the Covid gods to start learning Go.
The process of deciding what I wanted to use these 2 months for, was a lot more indecisive than I care to admit. I first looked into creating a game engine from scratch with C++,
but trashed that idea when I saw how overcrowded that space was. I didn't want to learn just another language, as at this point, I feel like learning a language is just reading
up their docs to check out their features and syntax. I don't really gain anything on a fundamental level after doing a 4 year undergrad where you're taught so many different
programming paradigms.

Nonetheless, I had a desire to contribute to something where my contributions would be meaningful. Looking at the crowded nature of contributing to things I already know, it seemed
logical to learn a new language and contribute to the language's development, instead of looking for stuff that by learning, benefits me.

Go was pretty much the winner of a coin toss between Rust and Go. I would love to learn Rust at a later date, as I've heard great things, and the features are right up my ally, but I don't
really feel like doing low level stuff right now.

The next question was what I would do after I learn Go. Well I'll get to that when I feel like I've gotten a good handle. I thought of creating a game engine with Go, but from the sounds of things,
it doesn't feel like it's mature or performant enough for that. I'll most probably just start contributing to same Go database projects.

## The setup

I followed the [Go Docs](https://golang.org/doc/), things went pretty smoothly. First impressions are that its pretty straight forward, kinda feels like how it felt learning Python for the first time.
I like that they manage external packages per repository using a go.mod file.

## Initial impressions

The syntax and quirks of Go are not similar to any language I know of, but I like it. I can imagine though, that forgetting some details could lead to headaches in the future. I was wondering why functions
from packages were capitalised, now I know it's because it's an exported name, and I also know I will forget this in the future, and write a zillion functions in a package and will have to go back and rename everything. It's kinda cool that they have good hints for comments, etc. Also, WOOHOO for returning multiple values.

Go allows for nested functions, and has this nifty thing called a slice, which is pretty much a c++ vector that can also shrink. You declare them like an array, but by omitting a size.
``` go
x := []int{1, 2} // A slice

y := [2]int{1,2} // An array

```

An init function takes the place of a constructor. There's no function overloading, but that's alright by me. It always just seemed like a feature for the sake of making a programmer
feel like they're doing something clever, as opposed to being a meaninfully useful in more than a handful of cases.

On a side note, the [GoLang FAQ](https://golang.org/doc/faq) page is the BOMB:

_"As for postfix vs. prefix, either would work fine but the postfix version is more traditional; insistence on prefix arose with the STL, a library for a language whose name contains, ironically, a postfix increment"_

It is a must read if you're going to be getting into the language.


I also like the way types are denoted, here's a map for example:
``` go
func x(name string) map[string]int {
    y := make(map[string]int)
    y[name] = 100
    return y
} // A function that returns a map that maps string to int

```

For loops can use a syntax similar to Python:
``` go
for _, name := range names {
    // replace _ with a variable if you want the index in a slice/array,
    // or to hold the key in case names is a map
}
```

Go also has pointers, which are a welcome addition to remove ambiguity when wanting to call by reference. It also have inbuilt unit testing, which seems simple enough.

[Here's all the stuff I made while learning from the Go docs](https://github.com/GokulVSD/ScratchPad/tree/master/Go)


