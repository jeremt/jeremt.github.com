R-Type
======

I developed a ECS engine in C++ and a scrolling spaceship game using it.

<img src="resources/images/rtype.png">

The game was initialized from several XML files which describe all entities and components to load and configure the game. Example:

```xml
<gameObject name="spaceship" tags="GOOD">

  <component name="Sprite">
    <param name="texture" value="spaceship_red" />
    <param name="size" value="vec3(0.095, 0.09, 0)" />
  </component>

  <component name="Transformable">
    <param name="position" value="vec3(0.02, 0.3, 0)" />
  </component>

  <component name="Move">
    <param name="speed" value="0.3" />
  </component>

</gameObject>

<gameObject path="levels/first_level.xml" />
```

The engine provided a lot of components to handle the movements, the behaviours and design of the game objects which allowed to easily and fastly create any type of game.

Moreover, the GUI was very easy to design using a stylesheet component to directly configure parameters such as apparence, animation or dimensions with configuration file with css-like syntax.

<img src="resources/images/rtype_gui.png">
