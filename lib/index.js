/*!
 * index.js
 * https://github.com/JeremieT/jeremiet.github.com
 * MIT licensed
 *
 * (c) Jérémie Taboada - <taboada.jeremie@gmail.com>
 */

~function () {

pages
  .add('work', ['my', 'origami', 'bilbo', 'rt', 'raphael-toolbox', 'more'])
  .add('cv')
  .add('contact')
  .generate(document.body, function (err) {
    if (err) document.body.innerHTML = '<p class="error">' + err + '</p>'
    else nav('body > section')
  })

jwerty.key('↑,↑,↓,↓,←,→,←,→,B,A,↩', function () {
  alert('Coming soon ❤')
})

}()