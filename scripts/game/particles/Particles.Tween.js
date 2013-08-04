
var Particles = Particles || {};

Particles.Tween = function (times, values) {
  this.times  = times || [];
  this.values = values || [];
}

Particles.Tween.prototype.lerp = function(dt) {
  var i = 0;
  var n = this.times.length;
  while (i < n && dt > this.times[i])
    ++i;
  if (i == 0)
    return this.values[0];
  if (i == n)
    return this.values[n-1];
  var p = (dt - this.times[i-1]) / (this.times[i] - this.times[i-1]);
  if (this.values[0] instanceof THREE.Vector3)
    return this.values[i-1].clone().lerp(this.values[i], p);
  else // its a float
    return this.values[i-1] + p * (this.values[i] - this.values[i-1]);
}