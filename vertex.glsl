precision mediump float;

attribute vec2 vPosition;
uniform float scaleX;
uniform float constant;
uniform float jalanX;
uniform float jalanY;

void main() {
  mat4 translasi = mat4
    (constant, 0.0, 0.0, 0.0,
     0.0, constant, 0.0, 0.0,
     0.0, 0.0, 1.0, 0.0,
     jalanX, jalanY, 0.0, 1.0 
    );

  mat4 scalationMatrix = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  gl_Position = translasi  * scalationMatrix * vec4(vPosition, 0.0, 1.0);
}
