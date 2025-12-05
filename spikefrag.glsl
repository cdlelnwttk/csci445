uniform float time; 
varying vec2 noise_uv;

void main() {
    vec3 red    = vec3(1.0, 0.0, 0.0);
    vec3 orange = vec3(1.0, 0.8, 0.0);  
    vec3 yellow = vec3(1.0, 1.0, 0.0);

    vec2 uv = fract(noise_uv + vec2(time * 1.2, 0.0));

    vec3 color = mix(yellow, orange, uv.y);
    color = mix(color, red, sin(uv.y));

    gl_FragColor = vec4(color, 1.0);
}
