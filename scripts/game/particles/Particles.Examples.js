
var Particles = Particles || {};

Particles.Examples =
{
  fountain: {
    positionStyle    : "CUBE",
    positionBase     : new THREE.Vector3(0,  5, 0),
    positionSpread   : new THREE.Vector3(10, 0, 10),
    
    velocityStyle    : "CUBE",
    velocityBase     : new THREE.Vector3(0,  160, 0),
    velocitySpread   : new THREE.Vector3(100, 20, 100), 

    accelerationBase : new THREE.Vector3(0, -100, 0),
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/heart.png'),

    colorBase               : new THREE.Vector3(0.9, 0.8, 0.7),

    angleBase               : 0,
    angleSpread             : 180,
    angleVelocityBase       : 0,
    angleVelocitySpread     : 360 * 4,
    
    sizeTween    : new Particles.Tween([0, 1], [1, 20]),
    opacityTween : new Particles.Tween([2, 3], [1, 0]),

    particlesPerSecond : 200,
    particleDeathAge   : 3.0,   
    emitterDeathAge    : 60
  },

  fireball: {
    positionStyle  : "SPHERE",
    positionBase   : new THREE.Vector3(0, 50, 0),
    positionRadius : 2,
        
    velocityStyle : "SPHERE",
    speedBase     : 40,
    speedSpread   : 8,
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/smokeparticle.png'),

    sizeTween    : new Particles.Tween([0, 0.1], [1, 150]),
    opacityTween : new Particles.Tween([0.7, 1], [1, 0]),
    colorBase    : new THREE.Vector3(80/255, 1, 0.4),
    blendStyle   : THREE.AdditiveBlending,  
    
    particlesPerSecond : 60,
    particleDeathAge   : 1.5,   
    emitterDeathAge    : 60
  },
  
  smoke: {
    positionStyle    : "CUBE",
    positionBase     : new THREE.Vector3(0, 0, 0),
    positionSpread   : new THREE.Vector3(10, 0, 10),

    velocityStyle    : "CUBE",
    velocityBase     : new THREE.Vector3(0, 150, 0),
    velocitySpread   : new THREE.Vector3(80, 50, 80), 
    accelerationBase : new THREE.Vector3(0,-10,0),
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/smokeparticle.png'),

    angleBase               : 0,
    angleSpread             : 720,
    angleVelocityBase       : 0,
    angleVelocitySpread     : 720,
    
    sizeTween    : new Particles.Tween([0, 1], [32, 128]),
    opacityTween : new Particles.Tween([0.8, 2], [0.5, 0]),
    colorTween   : new Particles.Tween([0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ]),

    particlesPerSecond : 200,
    particleDeathAge   : 2.0,   
    emitterDeathAge    : 60
  },
  
  clouds: {
    positionStyle  : "CUBE",
    positionBase   : new THREE.Vector3(-100, 100,  0),
    positionSpread : new THREE.Vector3(  0,  50, 60),
    
    velocityStyle  : "CUBE",
    velocityBase   : new THREE.Vector3(40, 0, 0),
    velocitySpread : new THREE.Vector3(20, 0, 0), 
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/smokeparticle.png'),

    sizeBase     : 80.0,
    sizeSpread   : 100.0,
    colorBase    : new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
    opacityTween : new Particles.Tween([0,1,4,5],[0,1,1,0]),

    particlesPerSecond : 50,
    particleDeathAge   : 10.0,    
    emitterDeathAge    : 60
  },
    
  snow: {
    positionStyle    : "CUBE",
    positionBase     : new THREE.Vector3(0, 200, 0),
    positionSpread   : new THREE.Vector3(500, 0, 500),
    
    velocityStyle    : "CUBE",
    velocityBase     : new THREE.Vector3(0, -60, 0),
    velocitySpread   : new THREE.Vector3(50, 20, 50), 
    accelerationBase : new THREE.Vector3(0, -10,0),
    
    angleBase               : 0,
    angleSpread             : 720,
    angleVelocityBase       :  0,
    angleVelocitySpread     : 60,
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/snowflake.png'),
      
    sizeTween    : new Particles.Tween([0, 0.25], [1, 10]),
    colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
    opacityTween : new Particles.Tween([2, 3], [0.8, 0]),

    particlesPerSecond : 200,
    particleDeathAge   : 4.0,   
    emitterDeathAge    : 60
  },
  
  rain: {
    positionStyle    : "CUBE",
    positionBase     : new THREE.Vector3(0, 200, 0),
    positionSpread   : new THREE.Vector3(600, 0, 600),

    velocityStyle    : "CUBE",
    velocityBase     : new THREE.Vector3(0, -400, 0),
    velocitySpread   : new THREE.Vector3(10, 50, 10), 
    accelerationBase : new THREE.Vector3(0, -10,0),
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/raindrop2flip.png'),

    sizeBase    : 8.0,
    sizeSpread  : 4.0,
    colorBase   : new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
    colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
    opacityBase : 0.6,

    particlesPerSecond : 1000,
    particleDeathAge   : 1.0,   
    emitterDeathAge    : 60
  },
    
  starfield: {
    positionStyle    : "CUBE",
    positionBase     : new THREE.Vector3(0, 200, 0),
    positionSpread   : new THREE.Vector3(600, 400, 600),

    velocityStyle    : "CUBE",
    velocityBase     : new THREE.Vector3(0, 0, 0),
    velocitySpread   : new THREE.Vector3(0.5, 0.5, 0.5), 
    
    angleBase               : 0,
    angleSpread             : 720,
    angleVelocityBase       : 0,
    angleVelocitySpread     : 4,

    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/spikey.png'),
    
    sizeBase    : 10.0,
    sizeSpread  : 2.0,        
    colorBase   : new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
    colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
    opacityBase : 1,

    particlesPerSecond : 20000,
    particleDeathAge   : 60.0,    
    emitterDeathAge    : 0.1
  },

  startunnel: {
    positionStyle  : "CUBE",
    positionBase   : new THREE.Vector3(0, 0, 0),
    positionSpread : new THREE.Vector3(10, 10, 10),

    velocityStyle  : "CUBE",
    velocityBase   : new THREE.Vector3(0, 50, 200),
    velocitySpread : new THREE.Vector3(40, -20, 80), 
    
    angleBase               : 0,
    angleSpread             : 720,
    angleVelocityBase       : 10,
    angleVelocitySpread     : 0,
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/spikey.png'),

    sizeBase    : 4.0,
    sizeSpread  : 2.0,        
    colorBase   : new THREE.Vector3(0.15, 1.0, 0.8), // H,S,L
    opacityBase : 1,
    blendStyle  : THREE.AdditiveBlending,

    particlesPerSecond : 500,
    particleDeathAge   : 4.0,   
    emitterDeathAge    : 60
  },

  firework: {
    positionStyle  : "SPHERE",
    positionBase   : new THREE.Vector3(0, 100, 0),
    positionRadius : 10,
    
    velocityStyle  : "SPHERE",
    speedBase      : 90,
    speedSpread    : 10,
    
    accelerationBase : new THREE.Vector3(0, -80, 0),
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/spark.png'),
    
    sizeTween    : new Particles.Tween([0.5, 0.7, 1.3], [5, 40, 1]),
    opacityTween : new Particles.Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
    colorTween   : new Particles.Tween([0.4, 0.8, 1.0], [ new THREE.Vector3(0,1,1), new THREE.Vector3(0,1,0.6), new THREE.Vector3(0.8, 1, 0.6) ]),
    blendStyle   : THREE.AdditiveBlending,  
    
    particlesPerSecond : 3000,
    particleDeathAge   : 2.5,   
    emitterDeathAge    : 0.2
  },

  candle: {
    positionStyle  : "SPHERE",
    positionBase   : new THREE.Vector3(0, 50, 0),
    positionRadius : 2,
    
    velocityStyle  : "CUBE",
    velocityBase   : new THREE.Vector3(0,100,0),
    velocitySpread : new THREE.Vector3(20,0,20),
    
    particleTexture : THREE.ImageUtils.loadTexture('resources/textures/smokeparticle.png'),
    
    sizeTween    : new Particles.Tween([0, 0.3, 1.2], [20, 150, 1]),
    opacityTween : new Particles.Tween([0.9, 1.5], [1, 0]),
    colorTween   : new Particles.Tween([0.5, 1.0], [ new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0) ]),
    blendStyle : THREE.AdditiveBlending,  
    
    particlesPerSecond : 60,
    particleDeathAge   : 1.5,   
    emitterDeathAge    : 60
  }
  
};