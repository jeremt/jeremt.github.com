Origami
=======

Origami is a jQuery plugin to generate css3 animation from mathematical sequences and equations.
For example, you can use cosinus to have a simple wave effect.

Take a look at the demo at:

<a href="http://jeremt.github.com/origami" class="img">
  <img src="img/origami.png">
</a>

Usage
-----

You just have to create a balise like this one:

```html
<div id="your-elem">
  <!-- Add `back` class to the elem behind -->
  <div class="back">
    Hello world!
  </div>
  <!-- ...then add your image -->
  <img src="path/to/img">
</div> <!-- #your-elem -->
```

and apply origami effect with your settings:

```js
$('#your-elem').origami({
  delay: 35,
  f: function (x) {
    return 10 * x + 10; // f(x) = 10x + 10
  }
}, function (anim) {
  // ...and trigger it :)
  $('#on').on('click', anim.on)
  $('#off').on('click', anim.off)
})
```