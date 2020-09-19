---
title: How Sony Vegas is Still Haunting Us
tags: [Video Editing, Hobby]
style: fill
color: primary
description: The dreaded default smart resample.
---

---

It's 2020 Ya'll. As an avid YouTube viewer, nothing drives me more nuts than stumbling across a channel which I really really like, only to not subscribe
because of ONE major turn off.

## Resampling
---

So, I wanna clarify what I mean by resampling before I get into why it's so annoying to me.
FPS resampling (of the likes used by video editing software) smoothens the picture when the project framerate differs from the footage framerate, this is done by generating extra frames through interpolation,
in order to match things up to the desired framerate. However, this results in some ghosting or motion blur.
This normally only happens when a you're combining footage with different framerates or when you change the speed of a clip (fast or slow motion).

Smart/forced resample (smart, forced, disabled) comes into play when your video has different fps (frames per second, modified by playback speed and speed envelope) is different from project settings.
Sony Vegas works with regular image sequences on track level. Frequency of frames is defined by project settings. For example, if you set up 25 fps, each 40 milliseconds new frame comes out. You can imagine it as momentary flashes of pictures and void between them. The void is here to emphasise that anything in between is lost, tracks have no information of what happened between frames after it processed video events.
If source media fps and synchronization time is exactly the same as that of the project, you get frame by frame correlation, in this case you need no resample to get frames from the track. Vegas can simply fetch input frames and process them. If source media has different fps, to generate something similar to what would be in desired time, Vegas needs to invent something.

## The kicker
---

The annoying thing, is that even adding a small snippet of a clip, or an image into your timeline, triggers resampling if it's set to smart. Even footage recorded in NTSC (29.97!) or PAL (25!) (from DVRs, camcorders, even several screen capture software) can trigger smart resampling, if you set your project to stick to 30 FPS or 60 FPS.
Sure, smart resampling may have been a good idea back when people were basically editing with a singular source, and found the idea of making something 'smoother' appealing (remember back when motion smoothing in TVs were a big thing). Its a horrible idea now, and makes any footage rendered with it enabled look like hot garbage.

People who don't really want to get into more complex editing tend to use Sony Vegas due to its simplicity. This encompasses a huge chunk of YouTubers. And guess what? SMART RESAMPLING IS ENABLED BY DEFAULT FOR EVERY SINGLE CLIP IMPORTED INTO THE TIMELINE, WITH NO ABILITY TO TURN IT OFF PROJECT WIDE, EXCEPT ON A PER CLIP BASIS.

I rest my case.