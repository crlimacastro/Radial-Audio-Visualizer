# Project 2 - Radial Audio Visualizer

Link to Application: <https://people.rit.edu/crl3554/330/project2>

Video Reel: TODO

My portfolio: <https://crlimacastro.github.io/>

# Documentation

## Contents

[Discussion Post](#Discussion-Post)

[Requirements](#Requirements)

[What went right & wrong](#What-went-right-&-what-went-wrong)

[Self Assessment](#Self-Assessment)

[Citations](#Citations)

[Log](#Log)

------------------------------------

## Discussion Post

I will be working solo and I will make a radial/circular audio visualizer

------------------------------------

## Requirements

### A. Overall Theme/Impact

#### Theme

Once again, I am going for a minimalist approach to the site. There are a lot of controls, but they have been placed at the bottom below the main attraction of the page; the visualizer itself. The visualizer inside the canvas is also minimalistic, the idea was to avoid making it too flashy so that it may be repurposed in the future and easily embedded to any other sites. I made sure to keep it minimalistic but with elegant, contained features such as the circle that slowly removes from the visualizer as the audio progresses.

#### Engagement

The engagement of this app at first comes from the hypnotizing effect that the audio bars have as they wave up and down to the sounds of the music. I made sure to add some extra toys to play around with the image or the sounds (like reverb) for after the magic loses its effect. I found a lot of fun uploading songs that had none to minimal audio effects and seeing how they sounded with reverb on them.

### B. User Experience

Sadly, the audio elements cannot be automatically played when a user enters the page. This poses a slight problem to engagement as there is no immediate satisfaction of something happening as soon as the page is entered. I had to find a way to hook users for the first few seconds and have them stick around to find out what the page is about, rather than leaving thinking it is just a blank page. A simple call to action below the title of the page was my attempt at resolving this issue. It queues widescreen users that there are controls below while still allowing me to keep the visualizer front and center at the top. It also urges users to play around with the controls so that they may see all the cool effects.

I made sure everything was organized in sections and properly grouped together to make it less overwhelming for the user.

### C. Media

#### Embedded Fonts

[Ubuntu](https://fonts.google.com/specimen/Ubuntu) by Dalton Maag

[Open Sans](https://fonts.google.com/specimen/Open+Sans) by Steve Matteson

### D. Code

#### Above and Beyond

1. To load the reverbs onto the reverb node I had to, once again, work with asynchronous code. This time in the shape of an ajax GET request.
``` javascript
function attachBuffer(convolverNode, src) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('GET', src, true);
    ajaxRequest.responseType = 'arraybuffer';
    ajaxRequest.onload = function() {
        let audioData = ajaxRequest.response;
        audioCtx.decodeAudioData(audioData, buffer => {
            convolverNode.buffer = buffer;
        }, function(e) { "Error with decoding audio data" + e.err });
    }
    ajaxRequest.send();
}
```
2. From the suggested additions, I looked ahead to file uploading with HTML File objects.
3. I also made it possible for the user to select the noise and tint color with HTML input color objects. Then in JS, I converted the hex color information to an rgb format for the image manipulation.


------------------------------------

## What went right & what went wrong

For this project I was not able to come up with something as creative as for project 1 early on. On one hand it did not take me to the extreme unknown territories of learning a brand-new library, but on the other it allowed me to focus on polishing and making the discussed audio visualizer as clean as possible. There were a lot of new things to tackle for me as it was with the Web Audio API and learning some of the other nodes we did not cover in the homework. Because I wanted to explore those, I decided to lighten the load by not taking on something extreme.

### Wishlist of Features

The only feature I had planned but was not able to implement on time was to add a delay node and effect.

------------------------------------

## Self-Assessment

While not as ambitious or above-and-beyond as project 1, I was still able to create something very polished for this project and I am proud of how it came out.

**Grade** - 95%

------------------------------------

## Citations

IM Reverbs Pack from voxengo.com at https://www.voxengo.com/impulses/

Dream Sweet in Sea Major by Miracle Musical at https://www.youtube.com/watch?v=uxyM7vhU0uU

------------------------------------

## Log

|   Date   | Description                                                                                                                                                            |
|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 10/18/20 | Created repo                                                                                                                                                           |
| 10/19/20 | Created radial audio visualizer polygon                                                                                                                                |
| 10/20/20 | Created average power circle and implemented previous bitmap operations and audio filters                                                                              |
| 10/21/20 | Created grayscale and tint effects. Added Track upload option for playing any sounds                                                                                   |
| 10/22/20 | Created sepia effect. Added noise amount slider                                                                                                                        |
| 10/23/20 | Created reverb effect. Created waveform visualizer. Optimized scripts                                                                                                  |
| 10/25/20 | Refined CSS. Made the frequency polygon start drawing points from the average frequency radius. Created void circle progress indicator. Added the all-powerful favicon |