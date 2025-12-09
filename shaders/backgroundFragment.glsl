uniform sampler2D noise;
varying vec2 our_uv;
varying vec3 pos;
uniform float time; 
uniform vec3 color;

void main() {
    float n = texture2D(noise, our_uv * 2.0).r;
    float r = sin(pos.x * time) * 0.5 + 0.5;
    float g = sin(pos.y * time) * 0.5 + 0.5;
    float b = sin(pos.z * time) * 0.5 + 0.5;
    float alpha = sin(n + time + pos.z);
    gl_FragColor = vec4(r, g, b, alpha);

}

