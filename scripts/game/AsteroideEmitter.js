
~function () {

function AsteroideEmitter(scene) {
  this.scene = scene;
  this.spawnTime = 1;
  this.currentTime = 0;
  this.asteroides = [];
}

AsteroideEmitter.prototype.update = function (deltaTime) {
  if (this.currentTime < this.spawnTime * 1000)
    this.currentTime += deltaTime;
  else {
    this.currentTime = 0;
    var a = new Asteroide(100, 100);
    this.asteroides.push(a);
    this.scene.add(a.mesh);
  }
  for (var i = this.asteroides.length - 1; i >= 0; --i) {
    if (this.asteroides[i].mesh.position.z > 10) {
      this.scene.remove(this.asteroides[i].mesh);
      this.asteroides.splice(i, 1);
    } else
      this.asteroides[i].update(deltaTime);
  }
}

AsteroideEmitter.prototype.hit = function (target) {
  for (var i = this.asteroides.length - 1; i >= 0; --i) {
    if (this.asteroides[i].hit(target)) {
      this.scene.remove(this.asteroides[i].mesh);
      this.asteroides.splice(i, 1);
      return true;
    }
  }
  return false;
}

window.AsteroideEmitter = AsteroideEmitter;

}();