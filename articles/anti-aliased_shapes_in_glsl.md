The purpose of this article is to show some technics to draw simple anti-aliased shapes in GLSL shaders.
It a good pratice to do so because it's faster and more precise than post-processed anti-aliasing such
as FXAA (because it involves a render to texture).


To test our shaders, we will use the following [THREE.js](http://threejs.org/) code that contains a
rotating plane and apply our shader on it (copy and past this code in an html file and
open it on a browser).

```
<!DOCTYPE html>
<style>body {margin: 0;}</style>
<div id="canvas"></div>
<script src="//ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js"></script>
<script id="vertex" type="x-shader/x-vertex">

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

</script>
<script id="fragment" type="x-shader/x-fragment">

#ifndef GL_ES
// Non OpenGL ES devices doesnt support precision qualifiers, so we do
// nothing instead
#define lowp
#define mediump
#define highp
#endif

uniform lowp vec3 color;
uniform lowp float alpha;
varying highp vec2 vUv;

void main() {
  gl_FragColor = vec4(color, alpha);
}

</script>
<script>

// config
var angularSpeed = 0.05;
var fov = 45;

// renderer
var renderer = new THREE.WebGLRenderer({alpha: true}); // GL_ALPHA_BLENDING
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(
  fov, window.innerWidth / window.innerHeight, 1, 1000
);
camera.position.z = 800;

// scene
var scene = new THREE.Scene();

// plane
var plane = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300),
  new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertex").innerHTML,
    fragmentShader: document.getElementById("fragment").innerHTML,
    uniforms: {
      color: {type: 'c', value: new THREE.Color(0x3498db)},
      alpha: {type: 'f', value: 1.0}
    }
  })
);
scene.add(plane);

// animation
var lastTime = 0;
!function () {
  var time = new Date().getTime();
  var timeDiff = time - lastTime;
  var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
  plane.rotation.z += angleChange;
  lastTime = time;

  renderer.render(scene, camera);
  requestAnimationFrame(arguments.callee);
}();

</script>
```

For now, we are just filling the quad with blue color, like you can see in the fragment shader:

```
#ifndef GL_ES
// Non OpenGL ES devices doesnt support precision qualifiers, so we do
// nothing instead
#define lowp
#define mediump
#define highp
#endif

uniform lowp vec3 color;
uniform lowp float alpha;
varying highp vec2 vUv;

void main() {
  gl_FragColor = vec4(color, alpha);
}
```

From now, we will update this fragment unil we get our anti-aliased rectangle shape working.
The first step is to detect the border of the quad. To do so, we will use the UV coordinates.
For instance, if the vUv value is (0, 0) that means we are in the left corner. So we will draw
a 10% border around the quad:

```
#ifndef GL_ES
// Non OpenGL ES devices doesnt support precision qualifiers, so we do
// nothing instead
#define lowp
#define mediump
#define highp
#endif

uniform lowp vec3 color;
uniform lowp float alpha;
varying highp vec2 vUv;

void main() {
  gl_FragColor = vec4(color, alpha);
  if (vUv.x > 0.1 && vUv.y > 0.1 &&
      1.0 - vUv.x > 0.1 && 1.0 - vUv.y > 0.1)
      gl_FragColor.a = 0.0;
}
```

When you write a shader, optimization is important. So, we will do 2 things:

- Factorize the condition for x and y using the function step (for SIMD optimization).
- Remove the if branch by using an arithmetic expression instead.

```
#ifndef GL_ES
// Non OpenGL ES devices doesnt support precision qualifiers, so we do
// nothing instead
#define lowp
#define mediump
#define highp
#endif

uniform lowp vec3 color;
uniform lowp float alpha;
varying highp vec2 vUv;

void main() {
  gl_FragColor = vec4(color, alpha);
  vec2 border = step(vec2(0.1), vUv) * step(vec2(0.1), vec2(1) - vUv);
  gl_FragColor.a = 1.0 - border.x * border.y;
}
```

We are almost done. Before the final result, we will draw a quad with a blured border. To do so, we will:

- Replace the step function by smoothstep() to get a smoothed border instead of the current sharp one.
- Then, reverse the condition on gl_FragColor.a to have the transparency on the border rather than on the center.

```
#ifndef GL_ES
// Non OpenGL ES devices doesnt support precision qualifiers, so we do
// nothing instead
#define lowp
#define mediump
#define highp
#endif

uniform lowp vec3 color;
uniform lowp float alpha;
varying highp vec2 vUv;

void main() {
  gl_FragColor = vec4(color, alpha);
  vec2 border = smoothstep(vec2(0), vec2(0.1), vUv) *
                smoothstep(vec2(0), vec2(0.1), vec2(1) - vUv);
  gl_FragColor.a = border.x * border.y;
}

```

However, we don't want a blured border but a subtle anti-aliased border. To obtain this, we will have
2 more modifications:

- Instead of a 10% border we want just 1 pixel border. I won't talk about the math in details but the
fwidth function will do the job (for GL_ES we need to enable an extension to use it).
- The function smoothstep is great for blur, but we can do something more appropriate and faster with
a linear interpolation. Unfortunately, this function doesnt exist, but we will do it ourself!

```
#ifndef GL_ES
// Non OpenGL ES devices doesnt support precision qualifiers, so we do
// nothing instead
#define lowp
#define mediump
#define highp
#else
// to have functions like fwidth for OpenGL ES or WebGL, the extension should
// be explicitly enabled.
#extension GL_OES_standard_derivatives : enable
#endif

// linear step between edge0 (value=0.) and edge1 (value=1.)
#define linearstep(edge0, edge1, x) clamp((x - (edge0)) / (edge1 - (edge0)), 0.0, 1.0)

uniform lowp vec3 color;
uniform lowp float alpha;
varying highp vec2 vUv;

void main() {
  highp vec2 uvPixel = fwidth(vUv);

  gl_FragColor = vec4(color, alpha);
  vec2 border = linearstep(vec2(0), uvPixel, vUv) *
                linearstep(vec2(0), uvPixel, vec2(1) - vUv);
  gl_FragColor.a = border.x * border.y;
}
```

## Bonus

The good thing with this technique is that you can use it with a lot of different shapes such as circle, triangle or
rounded rect.

Rounded rect shader:

```
#ifndef GL_ES
#define lowp
#define mediump
#define highp
#else
#extension GL_OES_standard_derivatives : enable
#endif

varying highp vec2 vUv;

uniform highp float aspectRatio;
uniform highp float radiusRatio;

uniform lowp vec3 color;
uniform lowp float alpha;

// linear step between edge0 (value=0.) and edge1 (value=1.)
#define linearstep(edge0, edge1, x) clamp((x - (edge0)) / (edge1 - (edge0)), 0.0, 1.0)

void main() {
  highp vec2 uv = abs((vUv - vec2(0.5)) * vec2(aspectRatio, 1.0));
  highp float halfWidth = aspectRatio * 0.5;
  highp float radius = clamp(radiusRatio, 0.0, 1.0) * min(halfWidth, 0.5);
  highp vec2 center = vec2(halfWidth, 0.5) - vec2(radius);

  // outer edge
  highp vec2 halfUv = uv - vec2(halfWidth, 0.5);
  highp float d = mix(-max(halfUv.x, halfUv.y), radius - distance(uv, center),
      float(uv.x >= center.x && uv.y >= center.y));

  // apply anti-aliasing
  highp float border = linearstep(0.0, fwidth(d), d);
  gl_FragColor = vec4(color, alpha * border);
}
```