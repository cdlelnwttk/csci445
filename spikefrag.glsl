// uniform vec3 baseColor;
// varying vec3 vPos;

// void main() {
//     gl_FragColor = vec4(baseColor, 1.0);
// }

uniform vec3 baseColor;
varying vec2 vPos;
uniform float time;

void main() {
    float t = sin(time * 7.0) * 0.5 + 0.5;

    vec3 red    = vec3(1.0, 0.0, 0.0);
    vec3 orange = vec3(1.0, 0.5, 0.0);
    vec3 color = mix(red, orange, t);

    gl_FragColor = vec4(color, 0.5); 
}


// uniform vec3 baseColor;
// void main() {
//     gl_FragColor = vec4(baseColor, 1.0);
// }
