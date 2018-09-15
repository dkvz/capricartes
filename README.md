# Capricartes
Pure Javascript project (meaning no framework, no backend required) to generate greeting cards with my CATS IN IT.

Uses a ton of "newer" JS features (promises, classes, CSS stuff, classList (lol), ...) I almost even used string litterals but then I felt really bad and didn't. For the moment I'm not doing any Babeling because I don't want this to run on pre-ES6 browsers anyway.

I started designing "effects" or different artifacts to apply to a container element in `card-stuff.js` using a formalism of each one these being an object with a name, a preload function that returns a promise, and an enable function that gets the container element as a parameter.

But then it got kind of crazy. Which is alright given what this project actually does.

This was my usual intro giving excuses as to why the code is really weird.

I use Webpack to bundle my JS files together.

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
- [ ] Kitch repeat of one of the pics, to be decided
- [x] Pullz background
- [ ] Something like this: https://codepen.io/P1N2O/pen/pyBNzX
- [ ] Some piece of art with a cat spliced in, la dernière scène? Chapelle Sixtine?
- [ ] Hyrax, I think it's the pic from Wikipedia (or Wikimedia?)

### Images
* All the crapic.dkvz.eu images, with their vibration animation.
* Add a rabbit in there.

### Effects
**NB:** In fact it seems like we could probably stack effects and thus have to replace the "pick one" with multiple choice.

**NB:** Effects can't really be previewed. Or can they? Just preview on the form view.

I decided against effect preview for the moment, also we can select more than one.

* DONE - Request animation frame crapic head bouncing around
* Add a glowing sun? Just a round div with a gradient that transitions in size (the div does)
  * Don't forget to use 3D transform to use the GPU
* Add a rainbow (huge svg to draw)
* Random weird gifs appearing
* Cat head coming in from the bottom then hiding again

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

## TODO
- [ ] I explicitly mention some fields are optional, but actually everything is optional except maybe for the background. I should clarify that one way or another.
- [ ] Music select and preview are really not on the same level on Chrome.
- [ ] Draw all my SVGs inline instead of using some of them from a static file.
- [ ] Double check that we can't actually add HTML code to the pages using the URL.
- [ ] Make it so that we can give a callback to moving-img-effects constructor so that I can remove the "loading" from my slide thingy.
- [ ] Test using special characters (emojis) in slides or the title, in all browsers.
- [ ] Add the rotating crapice to the title. Maybe only rotate on hover? And/Or add it to the loading page.
- [ ] Add links to my stuff at the bottom.
- [x] Use border-radius on the input tags. And probably also on the buttons.
- [x] Try using transparent input fields.
- [ ] Add font antialiasing.
- [ ] Add a huge neon-glow on hover over inputs and buttons.
- [x] Use template tags for reusable stuff that I need to insert.
- [ ] Use a transition for the hover on buttons.
- [x] onChange doesn't trigger when clicking the same element in a select element. I need another plan for that. The first option element should be the amount of slides. That way it should work.