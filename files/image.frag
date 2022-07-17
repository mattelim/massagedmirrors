precision mediump float;

varying vec2 vertPos;

uniform sampler2D image;

void main() {
  vec2 uv = vertPos;
  gl_FragColor = texture2D(image, uv);
}
