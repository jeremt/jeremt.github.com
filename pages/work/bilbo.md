Bilbo
=====

Il s'agit d'une télécommande générique pour controller des présentations HTML5 dans le navigateur.

Le module NowJS m'a permit de réalisé un outil temps réel utilisant les WebSockets. De plus j'ai réalisé le code de l'application en CoffeeScript.

<a href="https://github.com/jeremt/BilboJS" class="img">
  <img src="img/bilbo.png">
</a>

Principe
--------

Le principe est simple, on lance la présentation avec node :

```
coffee bilbo
```

Puis on accède au serveur :

- `localhost:4242/remote?key=PRIVATE_KEY` - commander la présentation en se connectant autant que "remote"
- `localhost:4242` - voir autant que spectateur la présentation synchronisée en temps réel sur votre ordinateur, votre tablette ou votre smartphone

Pour réaliser votre présentation c'est aussi très simple, le fichier `config.json` contient la config et les chemins vers les fichiers de la présentation :

```
{
  "framework" : "impress",
  "style"     : "pres.css",
  "markup"    : "pres.jade",
  "init"      : "init.jade",
  "key"       : "my_private_key"
}
```
