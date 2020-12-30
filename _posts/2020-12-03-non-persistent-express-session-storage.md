---
title: "Non-persistant Express session storage"
tags: [NodeJS, Express, Session Handling, Backend]
style: border
color: primary
description: What I've learnt after dealing with Node and session handling.
---

## Why non-persistant

Generally speaking, server-side session handling is performed by issuing a session ID to a client. This is done either by setting a cookie on the client's browser, or by utilising the client's localStorage.
The session ID is nothing but an identifier used by the server to associate some data to a particular session. In normal circumstances, you would want this data to stay persistent, so that a server crash or restart doesn't nuke all the session data.
This is done by using an external database as a session store for the session handler.

I however, encountered a situation where I did not want the session data to be persistent. I was developing a universal RESTful multi-user quiz platform, with some robust anti-cheat measures.
This involved me having to utilise a synchronised timer on both the client and the server, and maintaining quiz state incase of disconnections, which was accomplished by saving answers asynchronously to the server.
Everything was randomised, and individual quiz parameters can be changed on the fly, even while users have quizes in progress. A lot of the design considerations were thought through before I commenced dev work. I established that once a quiz is initiated, 
it will be counted as an attempt no matter what, unless the server crashes or goes offline in the middle of the quiz. To that extent, when time runs out server-side, quizes are auto evaluated based on previous asynchronously submitted answers. This is incase for whatever reason, the user hadn't manually submitted.
If the server did crash or go offline, the attempt is ignored, and wouldn't be counted, so as to remain fair to the user.

That is the basis behind why I ended up using non-persistant session storage, even though its traditionally not recommended.

## How non-persistant

``` javascript
const express = require('express');
const app = express();
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

app.use(session({
  secret: 'Some hard to guess string',
  // store: <instance of some store>,   // If not specified, uses MemoryStore
  resave: false,
  saveUninitialized: false,
  genid: function(req) {
      return uuidv4(); // Uses UUIDs for session IDs
  }
}));
```

I initially went the route of just using a MongoStore and cleaning the store on initialisation, but soon bailed on that as it was pointless to do so. I could just use the default MemoryStore for my use case.
I didn't use cookies as I was targetting modern browsers, and it would save me the hassle of cookie management. As I was trying to create a platform with robust anti-cheat, I had to consider the possibility 
of malicious users trying to discard or overwrite their attempt in case the quiz didn't go their way. They could do this by logging in with the same credentials but using a different browser.
I thwarted that by keeping track of the session IDs of the sessions that had quizes in progress, and prevented access incase a quiz was in progress for the credentials provided, and the current session ID was different from the tracked session ID. I also had to consider the scenarios where a user could generate dirty reads and non-repeatable read conditions by opening two tabs of the quiz on the same browser.
Session ID is reused if using the same browser, disregarding tabs. This was handled using the same solution mentioned before, but saved the quiz state that was larger over a smaller one. Generating unique session IDs in order to avoid session conflict was essential. I used [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) for that purpose.

## The snarls

Turns out that race conditions are mighty prevelant when using MemoryStore sessions in an asynchronous environment. It seems to me that data is simply stored in the request's session object, and hence is non-atomic.
This was exhaustingly annoying, as I had a plethora of operations which I had to perform on the quiz state at predefined intervals.

For example, the server-side timer ticked down per active quiz, which is stored in the session. Asynchronous answer updates that came in were being written over due to the timer interval updates.
I had to set up locks on the session object, and clear or restart the intervals when modifying the session objects.

## Conclusion

I would have loved to share some more code snippets, but I'm limited by my organisation, as this platform was built for them, and as such, has copyrighted code. I hope I've given a broad overview on using sessions in this unusual way.
What prompted me to make this post was the widespread consensus online that any competent developer should not use MemoryStore. That is simply not true, it has its use cases, one of which I have presented before you, hopefully in a sufficient manner.





