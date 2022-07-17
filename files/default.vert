attribute vec3 aPosition;

varying vec2 vertPos;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  vertPos = aPosition.xy;
}
