
var Particles = Particles || {};

Particles.Effect = function (settings) {

  // Initialize move properties.

  this.positionStyle = "CUBE";    
  this.positionBase = new THREE.Vector3();
  this.positionSpread = new THREE.Vector3();
  this.positionRadius = 0;
  
  this.velocityStyle = "CUBE";  
  this.velocityBase = new THREE.Vector3();
  this.velocitySpread = new THREE.Vector3(); 

  this.speedBase   = 0;
  this.speedSpread = 0;

  this.accelerationBase = new THREE.Vector3();
  this.accelerationSpread = new THREE.Vector3();  
  
  this.angleBase = 0;
  this.angleSpread = 0;
  this.angleVelocityBase = 0;
  this.angleVelocitySpread = 0;
  this.angleAccelerationBase = 0;
  this.angleAccelerationSpread = 0;
  
  this.sizeBase   = 0.0;
  this.sizeSpread = 0.0;
  this.sizeTween  = new Particles.Tween();

  // Initialize render properties.

  this.colorBase   = new THREE.Vector3(0.0, 1.0, 0.5); 
  this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
  this.colorTween  = new Particles.Tween();
  
  this.opacityBase   = 1.0;
  this.opacitySpread = 0.0;
  this.opacityTween  = new Particles.Tween();

  this.blendStyle = THREE.NormalBlending; // false;

  this.particles = [];
  this.particlesPerSecond = 100;
  this.particleDeathAge = 1.0;
  
  // Initialize emitter properties.

  this.emitterAge = 0.0;
  this.emitterAlive = true;
  this.emitterDeathAge = 60;
  
  if (settings === undefined)
    return;
  
  for (var key in settings) 
    this[key] = settings[key];
  
  // Attach tweens to particles.

  Particles.Particle.prototype.sizeTween = this.sizeTween;
  Particles.Particle.prototype.colorTween = this.colorTween;
  Particles.Particle.prototype.opacityTween = this.opacityTween;  

  // Compute the maximal number of particles for this emitter.

  this.particleCount =
    this.particlesPerSecond *
    Math.min(this.particleDeathAge, this.emitterDeathAge);

  // Create threejs particle system.
  
  this.particlesGeometry = new THREE.Geometry();
  this.particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
      texture: {type: "t", value: this.particleTexture},
    },
    attributes: {
      customVisible: {type: 'f', value: []},
      customAngle: {type: 'f', value: []},
      customSize: {type: 'f', value: []},
      customColor: {type: 'c', value: []},
      customOpacity: {type: 'f', value: []}
    },
    vertexShader:   Particles.Shader.vertex,
    fragmentShader: Particles.Shader.fragment,
    transparent: true, 
    alphaTest: 0.5,
    blending: THREE.NormalBlending,
    depthTest: true
  });
  this.mesh = new THREE.ParticleSystem();
}
  
Particles.Effect.prototype._randomValue = function (base, spread) {
  return base + spread * (Math.random() - 0.5);
}

Particles.Effect.prototype._randomVector3 = function (base, spread) {
  var rand3 = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  );
  return new THREE.Vector3()
    .addVectors(base, new THREE.Vector3()
      .multiplyVectors(spread, rand3));
}


Particles.Effect.prototype._createParticle = function () {
  var particle = new Particles.Particle();

  // Initialize positions
  switch (this.positionStyle) {
    case "CUBE":
      particle.position =
        this._randomVector3(this.positionBase, this.positionSpread);
      break;
    case "SPHERE":
      var z = 2 * Math.random() - 1;
      var t = 6.2832 * Math.random();
      var r = Math.sqrt(1 - z * z);
      var vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z);
      particle.position = new THREE.Vector3()
        .addVectors(
          this.positionBase,
          vec3.multiplyScalar(this.positionRadius)
        );
      break;
    default:
      Particles.debug && console.warn("Invalid position style.");
      break;
  }
  
  // Initialize velocities
  switch (this.velocityStyle) {
    case "CUBE":
      particle.velocity = this._randomVector3(
        this.velocityBase,
        this.velocitySpread
      );
      break;
    case "SPHERE":
      var direction = new THREE.Vector3().subVectors(particle.position, this.positionBase);
      var speed = this._randomValue(this.speedBase, this.speedSpread);
      particle.velocity = direction.normalize().multiplyScalar( speed );
      break;
    default:
      Particles.debug && console.warn("Invalid velocity style.");
      break;
  }
  
  particle.acceleration = this._randomVector3( this.accelerationBase, this.accelerationSpread ); 

  particle.angle = this._randomValue( this.angleBase,             this.angleSpread );
  particle.angleVelocity = this._randomValue( this.angleVelocityBase,     this.angleVelocitySpread );
  particle.angleAcceleration = this._randomValue( this.angleAccelerationBase, this.angleAccelerationSpread );

  particle.size = this._randomValue( this.sizeBase, this.sizeSpread );

  var color = this._randomVector3( this.colorBase, this.colorSpread );
  particle.color = new THREE.Color().setHSL( color.x, color.y, color.z );
  
  particle.opacity = this._randomValue( this.opacityBase, this.opacitySpread );

  particle.age = 0;
  particle.alive = 0;
  
  return particle;
}

Particles.Effect.prototype.initialize = function () {
  // Remove duplicate code somehow,
  // here and in update function below.
  for (var i = 0; i < this.particleCount; i++) {
    this.particles[i] = this._createParticle();
    this.particlesGeometry.vertices[i] = this.particles[i].position;
    this.particlesMaterial.attributes.customVisible.value[i] = this.particles[i].alive;
    this.particlesMaterial.attributes.customColor.value[i] = this.particles[i].color;
    this.particlesMaterial.attributes.customOpacity.value[i] = this.particles[i].opacity;
    this.particlesMaterial.attributes.customSize.value[i] = this.particles[i].size;
    this.particlesMaterial.attributes.customAngle.value[i] = this.particles[i].angle;
  }
  
  this.particlesMaterial.blending = this.blendStyle;
  if ( this.blendStyle != THREE.NormalBlending) 
    this.particlesMaterial.depthTest = false;
  
  this.mesh = new THREE.ParticleSystem( this.particlesGeometry, this.particlesMaterial );
  this.mesh.dynamic = true;
  this.mesh.sortParticles = true;
}

Particles.Effect.prototype.update = function(dt) {

  // Update particle data.

  var recycleIndices = [];
  for (var i = 0; i < this.particleCount; ++i) {
    if (this.particles[i].alive) {
      this.particles[i].update(dt);

      // Check if particle is dead.

      if ( this.particles[i].age > this.particleDeathAge ) {
        this.particles[i].alive = 0.0;
        recycleIndices.push(i);
      }

      // Update particle properties in shader.

      this.particlesMaterial.attributes.customVisible.value[i] = this.particles[i].alive;
      this.particlesMaterial.attributes.customColor.value[i]   = this.particles[i].color;
      this.particlesMaterial.attributes.customOpacity.value[i] = this.particles[i].opacity;
      this.particlesMaterial.attributes.customSize.value[i]    = this.particles[i].size;
      this.particlesMaterial.attributes.customAngle.value[i]   = this.particles[i].angle;
    }   
  }

  // Check if particle emitter is alive.

  if (!this.emitterAlive)
    return;

  // If no particles have died yet,
  // then there are still particles to activate

  if (this.emitterAge < this.particleDeathAge) {

    // Determine indices of particles to activate.

    var startIndex =
      Math.round(this.particlesPerSecond * (this.emitterAge +  0));
    var endIndex =
      Math.round(this.particlesPerSecond * (this.emitterAge + dt));
    if (endIndex > this.particleCount) 
      endIndex = this.particleCount; 

    // Then activate them.

    for (var i = startIndex; i < endIndex; ++i)
      this.particles[i].alive = 1.0;
  }

  // if any particles have died while the emitter is still running, we imediately recycle them
  for (var j = 0; j < recycleIndices.length; ++j) {
    var i = recycleIndices[j];
    this.particles[i] = this._createParticle();
    this.particles[i].alive = 1.0; // activate right away
    this.particlesGeometry.vertices[i] = this.particles[i].position;
  }

  // stop emitter?
  this.emitterAge += dt;
  if (this.emitterAge > this.emitterDeathAge)
    this.emitterAlive = false;
}

