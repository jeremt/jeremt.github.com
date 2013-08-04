
/**
 * Default EventEmitter constructor.
 */
function EventEmitter() {}

/**
 * Listen the given event.
 */
EventEmitter.prototype.on = function(event, cb) {
  this.events = this.events || {};
  this.events[event] = this.events[event] || [];
  this.events[event].push(cb);
}

/**
 * Stop listening the given event.
 */
EventEmitter.prototype.off = function(event, cb) {
  this.events = this.events || {};
  if (event in this.events)
    this.events[event].splice(this.events[event].indexOf(cb), 1);
}

/**
 * Trigger the given event.
 */
EventEmitter.prototype.trigger = function (event) {
  this.events || (this.events = {});
  if (event in this.events) {
    for(var i = 0; i < this.events[event].length; i++)
      this.events[event][i].apply(this,
        Array.prototype.slice.call(arguments, 1));
  }
}

/**
 * Static method to create EventEmitter from the given
 * object.
 */
EventEmitter.create  = function(obj){
  var props = ['on', 'off', 'trigger'];
  for (var i = 0; i < props.length; i++) {
    if (typeof obj === 'function')
      obj.prototype[props[i]]  = EventEmitter.prototype[props[i]];
    else
      obj[props[i]] = EventEmitter.prototype[props[i]];
  }
}