# Capricartes
Pure Javascript project (meaning no framework, no backend required) to generate greeting cards with my CATS IN IT.

## Setup

## Notes
* Maybe show the previews as a card that appears when something is selected?
  * Clicking elsewhere or pressing espace has to remove it. Not sure how to do that.
  * It's going to look weird on mobile.
    * Unless there's is some kind of autopreview option people can disable.

### Possible backgrounds
* Flashy colors from original crapic.dkvz.eu
* Kitch repeat of one of the pics, to be decided
* Pullz background
* Something like this: https://codepen.io/P1N2O/pen/pyBNzX
* Some piece of art with a cat spliced in, la dernière scène? Chapelle Sixtine?
* Hyrax, I think it's the pic from Wikipedia (or Wikimedia?)

### Images
* All the crapic.dkvz.eu images, with their vibration animation.
* Add a rabbit in there.

### Effects
**NB:** In fact it seems like we could probably stack effects and thus have to replace the "pick one" with multiple choice.

**NB:** Effects can't really be previewed. Or can they? Just preview on the form view.

* Request animation frame crapic head bouncing around
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

## TODO
- [ ] Add the rotating crapice to the title. Maybe only rotate on hover?
- [ ] Add links to my stuff at the bottom.
- [ ] Use border-radius on the input tags. And probably also on the buttons.
- [x] Try using transparent input fields.
- [ ] Add font antialiasing.
- [ ] We have to strip HTML from stuff or be careful to use innerText.
- [ ] Add a huge neon-glow on hover over inputs and buttons.
- [ ] Use template tags for reusable stuff that I need to insert.
- [ ] Use a transition for the hover on buttons.
