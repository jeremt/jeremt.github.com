
~function () {

function EffectManager(renderer, scene, camera) {
  this.renderer = renderer;
  this.scene = scene;
  this.camera = camera;
  this.composer = null;
}

EffectManager.prototype.none = function () {
  this.composer = null;
}

EffectManager.prototype.bloom = function () {
  this.composer = new THREE.EffectComposer(this.renderer);
  this.composer.addPass(
    new THREE.RenderPass(this.scene, this.camera)
 );
  var effectBloom = new THREE.BloomPass(1, 25, 4);
  this.composer.addPass(effectBloom);
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;
  this.composer.addPass(effectCopy);
}

EffectManager.prototype.render = function () {
  if (this.composer === null)
    this.renderer.render(this.scene, this.camera);
  else
    this.composer.render();
}

window.EffectManager = EffectManager;

}();