precision mediump float;

attribute vec2 vPositionKiri;
attribute vec2 vPositionKanan;
uniform float gambarKiri;
uniform float theta;
uniform float scaleX;
uniform float scaleY;

void main() {
  mat4 translasiKiri = mat4
    (1.0, 0.0, 0.0, 0.0,
     0.0, 1.0, 0.0, 0.0,
     0.0, 0.0, 1.0, 0.0,
     -0.4, 0.0, 0.0, 1.0 
    );

  mat4 translasiKanan = mat4
    (1.0, 0.0, 0.0, 0.0,
     0.0, 1.0, 0.0, 0.0,
     0.0, 0.0, 1.0, 0.0,
     0.4, 0.05, 0.0, 1.0 
    );

  mat4 rotationMatrix = mat4(
    cos(theta), sin(theta), 0.0, 0.0,
    -sin(theta), cos(theta), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  mat4 scalationMatrix = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, scaleY, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  if(gambarKiri==1.00) gl_Position = translasiKiri  * rotationMatrix * vec4(vPositionKiri, 0.0, 1.0);
  if(gambarKiri==0.00) gl_Position = translasiKanan * scalationMatrix * vec4(vPositionKanan, 0.0, 1.0);
}
