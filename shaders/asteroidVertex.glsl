attribute float angle;    
attribute float offset; 
attribute float speed;
uniform float radius;
uniform float size; 
uniform float time;
uniform sampler2D noise;

void main() {
    float n1 = texture2D(noise, uv * 2.0).r;
    float animated_angle = angle - time * speed;
    vec3 pos;
    pos.x = cos(animated_angle) * (radius + offset);
    // pos.y = 0.0;
    pos.y = sin(animated_angle) * (n1);
    pos.z = sin(animated_angle) * (radius + offset);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size;
}
