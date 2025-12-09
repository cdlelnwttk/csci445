uniform sampler2D tex;
varying vec2 our_uv; 

void main() {
    vec4 texColor = texture2D(tex, our_uv);
    gl_FragColor = vec4(texColor.rgb * 0.5, texColor.a); 
}