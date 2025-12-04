varying vec2 our_uv;
uniform vec3 ringColor; 
uniform float offset;
uniform float frequency;
uniform float opacity; 

void main() {
    vec2 uv = our_uv * 2.0 - 1.0;    
    
    float r = length(uv);

    float circleStripes = offset + cos(r * frequency);
    float mask = circleStripes;

    gl_FragColor = vec4(ringColor * mask, opacity * mask);
}