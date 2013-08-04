
~function () {

function Fireball(parent) {
  this.parent = parent;
  // this.engine = new Particles.Effect(Particles.Examples.fireball);
  // this.engine.initialize();
  // this.mesh = this.engine.mesh;

  if (Core.highQuality) {
    var material = new THREE.MeshPhongMaterial({
      color: 0x96c832
    });
  } else {
    var material = new THREE.MeshBasicMaterial({
      color: 0x96c832
    });
  }

  this.mesh = new THREE.Mesh(
    new THREE.CubeGeometry(5, 5, 5), material
  );
  this.mesh.position = parent.mesh.position.clone();
  this.mesh.position.z -= 10;
}

Fireball.prototype.move = function (deltaTime) {
  // this.engine.update(deltaTime);
  this.mesh.position.z -= deltaTime * 0.5;
  this.mesh.rotation.x += 0.005 * deltaTime;
  this.mesh.rotation.y += 0.005 * deltaTime;
  this.mesh.rotation.z += 0.005 * deltaTime;
  return this.mesh.position.z >= -250;
}

window.Fireball = Fireball;

}();