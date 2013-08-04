
var Particles = Particles || {};

Particles.Particle = function ()
{
  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3(); // units per second
  this.acceleration = new THREE.Vector3();

  this.angle = 0;
  this.angleVelocity = 0; // degrees per second
  this.angleAcceleration = 0; // degrees per second, per second

  this.size = 16.0;

  this.color = new THREE.Color();
  this.opacity = 1.0;

  this.age = 0;
  this.alive = 0;
}

Particles.Particle.prototype.update = function(dt)
{
  this.position.add( this.velocity.clone().multiplyScalar(dt) );
  this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );
  
  this.angle += this.angleVelocity * Math.PI/180 * dt;
  this.angleVelocity += this.angleAcceleration * Math.PI/180 * dt;

  this.age += dt;
  
  if (this.sizeTween.times.length > 0)
    this.size = this.sizeTween.lerp(this.age);
  if (this.colorTween.times.length > 0)
  {
    var colorHSL = this.colorTween.lerp(this.age);
    this.color.setHSL(colorHSL.x, colorHSL.y, colorHSL.z);
  }
  if (this.opacityTween.times.length > 0)
    this.opacity = this.opacityTween.lerp(this.age);
}