uniform sampler2D map;

void main() {
    vec2 center = gl_PointCoord - vec2(0.5); 
    float distanceFromCenter = length(center);
    
    if(distanceFromCenter > 0.5) discard;
    
    vec4 texColor = texture2D(map, gl_PointCoord);
    gl_FragColor = texColor;
}
