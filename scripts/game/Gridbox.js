
~function () {

function Gridbox(width, height, depth, step) {

  this.mesh = new THREE.Object3D();
  this.width = width;
  this.height = height;
  this.depth = depth;

  step || (step = 10);

  // Create grid material
  this.gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
  });

  function _createWallGeometry(w, h) {
    return new THREE.PlaneGeometry(w, h, w / step, h / step);
  }

  this.wallBack = new THREE.Mesh(
    _createWallGeometry(width, height),
    this.gridMaterial
  );

  this.wallBack.position.z -= depth / 2;

  this.wallLeft = new THREE.Mesh(
    _createWallGeometry(depth, height),
    this.gridMaterial
  );

  this.wallLeft.rotation.y = Math.PI * 90 / 180;
  this.wallLeft.position.x -= width / 2;

  this.wallRight = this.wallLeft.clone();
  this.wallRight.position.x += width;

  this.wallTop = new THREE.Mesh(
    _createWallGeometry(width, depth),
    this.gridMaterial
  );
  this.wallTop.rotation.x = Math.PI * 90 / 180;
  this.wallTop.position.y += height / 2;

  this.wallBottom = this.wallTop.clone();
  this.wallBottom.position.y -= height;

  this.mesh.add(this.wallBack);
  this.mesh.add(this.wallLeft);
  this.mesh.add(this.wallRight);
  this.mesh.add(this.wallTop);
  this.mesh.add(this.wallBottom);

}

window.Gridbox = Gridbox;

}();