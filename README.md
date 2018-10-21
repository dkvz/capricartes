# Capricartes
Pure Javascript project (meaning no framework, no backend required) to generate greeting cards with my CATS IN IT.

Uses a ton of "newer" JS features (promises, classes, CSS stuff, classList (lol), ...) I almost even used string litterals but then I felt really bad and didn't. For the moment I'm not doing any Babeling because I don't want this to run on pre-ES6 browsers anyway.

I started designing "effects" or different artifacts to apply to a container element in `card-stuff.js` using a formalism of each one these being an object with a name, a preload function that returns a promise, and an enable function that gets the container element as a parameter.

But then it got kind of crazy. Which is alright given what this project actually does.

This was my usual intro giving excuses as to why the code is really weird.

I use Webpack to bundle my JS files together and SCSS to process styles (mostly because I want to learn SASS).

A backend would be useful to generate smaller URLs. Or I might use a public API to do that in the future.

## Setup
Check the scripts section of package.json. Also run `npm install` at some point.

## Notes
**These are personal notes which do not belong in a README file but I don't like to create more TEXT FILES SUE ME**.

* Maybe show the previews as a card that appears when something is selected?
  * Clicking elsewhere or pressing espace has to remove it. Not sure how to do that.
  * It's going to look weird on mobile.
    * Unless there's is some kind of autopreview option people can disable.

### Possible backgrounds
- [x] Flashy colors from original crapic.dkvz.eu
- [x] Kitch repeat of one of the pics, to be decided - Could add more of these though
- [x] Pullz background
- [x] Something like this: https://codepen.io/P1N2O/pen/pyBNzX
- [ ] Some piece of art with a cat spliced in, la dernière scène? Chapelle Sixtine?
- [x] Hyrax, I think it's the pic from Wikipedia (or Wikimedia?)

### Images
* All the crapic.dkvz.eu images, with their vibration animation.
* Add a rabbit in there.

### Effects
**NB:** In fact it seems like we could probably stack effects and thus have to replace the "pick one" with multiple choice.

**NB:** Effects can't really be previewed. Or can they? Just preview on the form view.

I decided against effect preview for the moment, also we can select more than one.

* DONE - Request animation frame crapic head bouncing around
* DONE Add a glowing sun? Just a round div with a gradient that transitions in size (the div does)
  * Don't forget to use 3D transform to use the GPU
    * I don' t use 3D transform but I got this: https://codepen.io/dkvz/pen/mGvWxY
* DONE Add a rainbow (huge svg to draw)
  * Found one here: https://upload.wikimedia.org/wikipedia/commons/b/b0/PEO-rainbow_solid.svg
* DONE Random weird gifs appearing
* DONE Cat head coming in from the bottom then hiding again

### Babel
I debated using Babel. I think I'll stick to ES6 and not supporting older browsers.

I'll try making a switch do compile using Babel later on.

### SVGs
Instead of inlining SVGs I used the external file but had to hardcode a fill color in there:
```
<style type="text/css" >
  <![CDATA[

    * {
        fill: rgb(30, 30, 133);
    }

  ]]>
</style>
```
At some point I started using inline SVG anyway. So I should replace the shitty SVGs I'm using with drawings of my own.

### Old browser detection
I use this Modernizr link: https://modernizr.com/download?arrow-promises-setclasses&q=es6

## Issues
- [x] On Chrome, when you preview with a music, close the preview, then open a new one, the same music continues. It doesn't get replaced (it does in Firefox for some reason).

### The Chrome mobile audio preview issue
I get an exception on Chrome mobile only which basically looks like this:
```
Uncaught (in promise) DOMException: play() can only be initiated by a user gesture.
```

I've seen people say that you just have to call play from an event listener associated to a gesture (so click is fine).

That method should be `previewMusicClick`. And yes, play appears to be inside of a promise.

I think the play logic has to completely change. I probably have to use the specific media events to detect when loading is done, and stop spinning the preview play icon when that's done.

The whole 'preload' function from card-stuff is now useless as the entire logic of this has to change. Also, playing the sound on the greeting card itself will also require a click event listener somewhere (I was think a floating note and play button).
The "preloading" will then happen on the fly.

This should become useless in loadGreetingCard:
```
if (this.state.music !== undefined) 
      promises.push(cardStuff.tunes[this.state.music]);
```

I should make a whole test page that I can easily debug on Android.

## TODO
- [ ] If music is playing as preview in the form view, and we hit preview, it doesn't stop. It should stop.
- [x] Chrome mobile:
  - [x] Previewing audio doesn't seem to work -> Chrome doesn't play audio unless play() is directly in a UI event listener.
  - [x] The popping caprice head causes overflow scrolling to activate.
- [x] Add a capric favicon and all the social tags + meta description.
- [ ] Allow selecting different text styles for the title.
- [ ] Line feeds do not work in slides, I'd need to use <pre> or transform the line feeds into br elements somehow, which will require adding the HTML content, which is dangerous. That's a lot of whiches.
- [ ] Add inner drop shadow to the brown background to make it a little more interesting.
- [x] What happens if you add the query parameter "s" twice with twice the slides and the URL parsing?
- [x] Preview has to change the URL for the back button to work, I have notes about this in my Notebook and a test file somewhere.
- [ ] Instead of using data-ray as an attribute to select the rays of my rainbow I could group them inside a <g> element and use a query selector to get them from there. It should work.
- [ ] I could do error catching with calls to atob in cardFromUrl, as these can throw errors for invalid character, which right now results in a never-ending loading screen.
- [x] Music select and preview are really not on the same level on Chrome.
- [x] Put the 'close' SVG in an external file, and add a viewbox to it for easy resize.
- [x] Double check that we can't actually add HTML code to the pages using the URL.
- [ ] Test using special characters (emojis) in slides or the title, in all browsers.
- [ ] I don't have any effect with rotation, just keeping that in mind.
- [x] Add links to my stuff at the bottom.
- [x] Use border-radius on the input tags. And probably also on the buttons.
- [x] Try using transparent input fields.
- [ ] Add font antialiasing.
- [x] Use template tags for reusable stuff that I need to insert.
- [x] Use a transition for the hover on buttons.
- [x] onChange doesn't trigger when clicking the same element in a select element. I need another plan for that. The first option element should be the amount of slides. That way it should work.