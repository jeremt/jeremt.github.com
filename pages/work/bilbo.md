Bilbo
=====

BilboJS is a generic remote controller, to manage HTML5 presentations in-browser.

The NowJS module help me to create a realtime tool with WebSockets, and the whole app has been written in CoffeeScript.

<a href="https://github.com/jeremt/BilboJS" class="img">
  <img src="img/bilbo.png">
</a>

Principle
--------

The principle is very simple, assuming you have NodeJS and Coffee installed, just type:

```
coffee bilbo
```

Then access the server via:

- `localhost:4242/remote?key=PRIVATE_KEY` - control the presentation
- `localhost:4242` - to enjoy, as a reader, the real-time synchronized presentation on your computer, tablet or smartphone

To create the presentation, it's also very simple: the `config.json` contains both the configuration and the paths to the presentation's files:

```
{
  "framework" : "impress",
  "style"     : "pres.css",
  "markup"    : "pres.jade",
  "init"      : "init.jade",
  "key"       : "my_private_key"
}
```
