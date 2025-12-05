varying vec3 our_uv;
uniform float time;
uniform sampler2D noise;

void main() {
    vec3 red    = vec3(1.0, 0.1, 0.0);
    vec3 orange = vec3(1.0, 0.5, 0.0);
    vec3 yellow = vec3(1.0, 0.9, 0.2);

    vec2 uv = our_uv.xy * 0.5 + 0.5;
    uv += vec2(time * 0.1, 0.0); 

    float noiseValue = texture2D(noise, uv).r;

    vec3 color = mix(red, orange, noiseValue);

    gl_FragColor = vec4(color, 1.0); 
}

