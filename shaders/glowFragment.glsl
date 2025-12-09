uniform vec3 color;
uniform float opacity;
varying vec2 our_uv;
uniform float radius;

void main() {
    vec2 center = vec2(0.5, 0.5);

    float dist = distance(our_uv, center);
    if (dist < radius + 0.5) {
        discard;
    }

    gl_FragColor = vec4(color * 6.0, opacity);
}
