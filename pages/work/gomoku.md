Gomoku
======

One of the most interesting subject of my third year was the one about artificial intelligence.

Indeed, the main project was to create the AI of a Gomoku player with some specific optional rules:

- __double three__ - the player cannot create a pattern with two lignes of 3 aligned stones
- __five breakable__ - if the alignement of five is breakable during the next turn the player don't win

<img src="resources/images/gomoku_2.png">

We pay a particular attention to the data reprensentation using bitfield. Moreover, we implemented a minmax algorithm with alpha-beta purning for the AI.

<img src="resources/images/gomoku_1.png">
