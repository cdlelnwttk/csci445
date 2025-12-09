varying vec2 our_uv;
uniform float size;
varying vec3 pos;
void main(){
    our_uv=uv;
    pos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (1.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}