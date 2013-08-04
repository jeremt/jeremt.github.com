
var Particles = Particles || {};

Particles.Shader = {
  vertex: [
    "attribute vec3  customColor;",
    "attribute float customOpacity;",
    "attribute float customSize;",
    "attribute float customAngle;",
    "attribute float customVisible;",  // float used as boolean (0 = false, 1 = true)
    "varying vec4  color;",
    "varying float angle;",
    "void main()",
    "{",
      "if ( customVisible > 0.5 )",         // true
        "color = vec4( customColor, customOpacity );", //     set color associated to vertex; use later in fragment shader.
      "else",             // false
        "color = vec4(0.0, 0.0, 0.0, 0.0);",     //     make particle invisible.
        
      "angle = customAngle;",

      "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
      "gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );",     // scale particles as objects in 3D space
      "gl_Position = projectionMatrix * mvPosition;",
    "}"
  ].join("\n"),

  fragment: [
    "uniform sampler2D texture;",
    "varying vec4 color;",   
    "varying float angle;",   
    "void main()", 
    "{",
      "gl_FragColor = color;",
      
      "float c = cos(angle);",
      "float s = sin(angle);",
      "vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,", 
                            "c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);",  // rotate UV coordinates to rotate texture
          "vec4 rotatedTexture = texture2D( texture,  rotatedUV );",
      "gl_FragColor = gl_FragColor * rotatedTexture;",    // sets an otherwise white particle texture to desired color
    "}"
  ].join("\n")
};