uniform float time;
uniform float zoom;
uniform vec2 corners;
uniform vec2 resolution;

varying vec2 our_uv;

void main(){
    our_uv=uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}