# Capricartes
Pure Javascript project (meaning no framework, no backend required) to generate greeting cards with my CATS IN IT.

## Setup

## Notes

### Babel
I debated using Babel. I think I'll stick to ES6 and not supporting older browsers.

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
- [ ] Add the rotating crapice to the title.
- [ ] Use border-radius on the input tags. And probably also on the buttons.
- [x] Try using transparent input fields.
- [ ] Add font antialiasing.
- [ ] We have to strip HTML from stuff or be careful to use innerText.
- [ ] Add a huge neon-glow on hover over inputs and buttons.
- [ ] Use template tags for reusable stuff that I need to insert.
- [ ] Use a transition for the hover on buttons.
