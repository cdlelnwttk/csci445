attribute float angle;    
attribute float offset; 
attribute float speed;
uniform float radius;
uniform float size; 
uniform float time;
void main() {
    float animated_angle = angle + time * speed;
    
    vec3 pos;
    pos.x = cos(animated_angle) * (radius + offset);
    pos.y = 0.0;
    pos.z = sin(animated_angle) * (radius + offset);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size;
}
