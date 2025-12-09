uniform vec3 glowColor;
uniform float intensity;
varying vec2 our_uv;

void main() {
    vec2 center = vec2(0.5, 0.5);

    float dist = distance(our_uv, center);

    float alpha = pow(1.0 - dist, 4.0) * intensity;


    gl_FragColor = vec4(glowColor, alpha);
}
