// uniform vec3 baseColor;
// varying vec3 vPos;

// void main() {
//     gl_FragColor = vec4(baseColor, 1.0);
// }

uniform vec3 baseColor;
varying vec2 vPos;
uniform float time;

void main() {
    gl_FragColor = vec4(baseColor, 0.5);
}

// uniform vec3 baseColor;
// void main() {
//     gl_FragColor = vec4(baseColor, 1.0);
// }

