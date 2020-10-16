---
title: A Dive into React Hooks
tags: [React, Web Dev, Dev Logs, Exploration]
style: border
color: primary
description: React Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.
---

## Before you cry

React still supports classes, and will continue to support them for the forseeable future. Hooks are meant to streamline several parts of React development. The most major benefit
I see is that hooks allow you to break down component logic and compartmentalise them, so that they may be reused. This was previously harder, as it wasn't easy to break down a 
component when the component's logic was all over the place, across several life cycle methods. Having stateful logic all over the place also hindered testing and debugging.

Along with this, classes are kind of cumbersome in JavaScript, as "this" works differently to most programming languages, and having to bind handlers manually becomes too verbose.
The goal with hooks to eventually replace classes, by providing all the same functionality, in a simplified manner.

## Hooks in a nutshell

Hooks are a new addition in React 16.8. Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes. The following example renders a counter. When you click the button, it increments the value:

```javascript
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
`useState` is a hook. We call it inside a function component to add some local state to it. React will preserve this state between re-renders. `useState` returns a pair: the current state value and a function that lets you update it. You can call this function from an event handler or somewhere else. It’s similar to `this.setState` in a class, except it doesn’t merge the old and new state together, allowing you to update
individual state values instead of passing the entire state along with the value you want to update to the differencing algorithm to decide what to update.

You pass the initial value to `useState`, which will be assigned to `count` in the first render. Another difference with hooks is that the state no longer **has** to be an object. For posterity, here's the same
React code in the old way:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Here are a multiple state variables being declared:

```javascript
function ExampleWithManyStates() {
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

## The useEffect Hook

The Effect Hook, `useEffect`, adds the ability to perform things like data fetching, subscriptions, or manually changing the DOM from a function component. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes, but unified into a single API.

```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

When you call `useEffect`, you’re telling React to run your “effect” function after flushing changes to the DOM. Effects are declared inside the component so they have access to its props and state. By default, React runs the effects after every render — including the first render. (just like `componentDidMount` AND `componentWillUpdate` together)

```javascript
function FriendStatusWithCounter(props) {

  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  
    if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

The preceeding example showcases a couple of things:
1. Just like `useState` hook, you can have multiple `useEffect` hooks within a function component.
2. Effects may also optionally specify how to “clean up” after them by returning a function. For example, this component uses an effect to subscribe to a friend’s online status, and cleans up by unsubscribing from it. React would unsubscribe from our ChatAPI when the component unmounts, as well as before re-running the effect due to a subsequent render. (just like `componentWillUnmount`)

We can also tell the Effect hook to only run if a particular state variable has changed. This is similar to how before we would optimise using `componentWillMount`:

```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

OR

```javascript
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-run the effect if friend ID changes
```

## Things to remember

Hooks are JavaScript functions, but they impose two additional rules:
1. Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
2. Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions. There is just one other valid place to call Hooks — your own custom Hooks, which you can learn
about from the React docs.

Wrapping up, there are several more less frequently used hooks available, such as `useContext` and `useReducer`, which you can read up about on the React docs.

Overall, hooks drastically reduce the verbosity of React code, and reduces the number the things a React developer needs to remember to write clean code. A welcome change. 

Source: [React Docs](https://reactjs.org/docs/hooks-intro.html)
