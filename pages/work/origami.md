Origami
=======

Origami est un plugin jQuery qui permet de générer des animations 3d à partir d'animations mathématiques. En effet, le plugin permet de plier une image à partir de la courbe d'une équation.

Il est aussi possible de régler la vitesse de l'animation, ou d'ajouter des ombres par exemple. Pour plus d'info allez voir sur [github](https://github.com/jeremt/origami) :).

<a target="_blank" href="http://jeremt.github.com/origami" class="img">
  <img src="img/origami.png">
</a>

Usage
-----

Pour utiliser le plugin, il suffit de cibler l'element :

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

et de lui appliquer l'animation puis de l'utiliser lors d'un event par exemple :

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