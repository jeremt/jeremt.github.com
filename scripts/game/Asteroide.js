
~function () {

function Asteroide(width, height) {
  var _skins = [
    "resources/textures/asteroides/bilbo.png",
    "resources/textures/asteroides/boilertek.png",
    "resources/textures/asteroides/contact.png",
    "resources/textures/asteroides/fb.png",
    "resources/textures/asteroides/gh.png",
    "resources/textures/asteroides/gplus.png",
    "resources/textures/asteroides/in.png",
    "resources/textures/asteroides/mail.png",
    "resources/textures/asteroides/origami.png",
    "resources/textures/asteroides/resume.png",
    "resources/textures/asteroides/rtb.png",
    "resources/textures/asteroides/rt.png",
    "resources/textures/asteroides/twitter.png",
    "resources/textures/asteroides/website.png",
    "resources/textures/asteroides/work.png"
  ];

  var _texture = THREE.ImageUtils.loadTexture(
    _skins[~~(Math.random() * _skins.length)]
  );

  if (Core.highQuality) {
    var material = new THREE.MeshPhongMaterial({
      map: _texture
    });
  } else {
    var material = new THREE.MeshBasicMaterial({
      map: _texture
    });
  }

  this.mesh = new THREE.Mesh(
    new THREE.CubeGeometry(10, 10, 10), material
  );
  this.mesh.position.x = Math.random() * width - width / 2;
  this.mesh.position.y = Math.random() * height - height / 2;
  this.mesh.position.clamp(
    new THREE.Vector3(-width / 2 + 10, -height / 2 + 10, -250),
    new THREE.Vector3(width / 2 - 10, height / 2 - 10, -250)
  );
}

Asteroide.prototype.update = function (deltaTime) {
  this.mesh.rotation.x += 0.001 * deltaTime;
  this.mesh.rotation.y += 0.001 * deltaTime;
  this.mesh.rotation.z += 0.001 * deltaTime;
  this.mesh.position.z += 0.05 * deltaTime;
}

Asteroide.prototype.hit = function (target) {
  return this.mesh.position.distanceTo(target) < 20;
}

window.Asteroide = Asteroide;

}();