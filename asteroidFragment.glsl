uniform sampler2D map;

void main() {
    vec2 center = gl_PointCoord - vec2(0.5); 
    float distanceFromCenter = length(center);
    
    vec4 color = texture2D(map, gl_PointCoord);
    if(distanceFromCenter > 0.5) color.a = 0.0;
    
    
    gl_FragColor = color;
}
