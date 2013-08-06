
~function () {

function AsteroideEmitter(scene) {
  this.scene = scene;
  this.spawnTime = 1;
  this._currentTime = 0;
  this._spawnTimeUpdate = 0;
  this._asteroides = [];
}

var _updateSpawnTime = function (self, deltaTime) {
  if (self._spawnTimeUpdate < 20 * 1000)
    self._spawnTimeUpdate += deltaTime;
  else if (self.spawnTime > 0.05) {
    self._spawnTimeUpdate = 0;
    self.spawnTime /= 2;
  }
}

AsteroideEmitter.prototype.update = function (deltaTime) {
  _updateSpawnTime(this, deltaTime);
  if (this._currentTime < this.spawnTime * 1000)
    this._currentTime += deltaTime;
  else {
    this._currentTime = 0;
    var a = new Asteroide(100, 100);
    this._asteroides.push(a);
    this.scene.add(a.mesh);
  }
  for (var i = this._asteroides.length - 1; i >= 0; --i) {
    if (this._asteroides[i].mesh.position.z > 10) {
      this.scene.remove(this._asteroides[i].mesh);
      this._asteroides.splice(i, 1);
    } else
      this._asteroides[i].update(deltaTime);
  }
}

AsteroideEmitter.prototype.hit = function (target) {
  for (var i = this._asteroides.length - 1; i >= 0; --i) {
    if (this._asteroides[i].hit(target)) {
      this.scene.remove(this._asteroides[i].mesh);
      this._asteroides.splice(i, 1);
      return true;
    }
  }
  return false;
}

window.AsteroideEmitter = AsteroideEmitter;

}();