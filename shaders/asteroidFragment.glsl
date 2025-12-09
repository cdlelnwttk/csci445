uniform sampler2D map;
uniform sampler2D noise;
void main() {
    vec2 uv = gl_PointCoord;
    vec2 center = uv - vec2(0.5);
    float dist = length(center);
    float n1 = texture2D(noise, uv * 2.0).r;
    float radius = 0.5 + 4.5 * (n1 - 0.5);
    if(dist > radius) discard;

    vec4 color = texture2D(map, uv);
    gl_FragColor = vec4(color.rgb * 0.3, color.a);
}

