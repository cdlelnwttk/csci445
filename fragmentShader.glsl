uniform float time;
uniform float zoom;
uniform vec2 corner;
uniform vec2 resolution;

varying vec2 our_uv;

vec3 color;
float max=1024.0;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float randTime(){
  return rand(vec2(3.0*time,5.0*time));
}

void main() {
          vec2 c=our_uv*zoom+corner;
          vec2 offset=our_uv-vec2(0.5,0.5);
          float d=1.0-fract(length(offset.x*offset.x+offset.y*offset.y));
          vec2 z=vec2(0.0,0.0);
          float counter=0.0;
          float zx2=0.0;
          float zy2=0.0;
          while (zx2+zy2<4.0 && counter<max) {
            z=vec2(zx2-zy2,2.0*z.x*z.y)+c;  
            zx2=z.x*z.x;
            zy2=z.y*z.y;
            counter=counter+1.0;
          }
        float r=25.0*(counter/max);
        float g=rand(our_uv);
        float b=rand(our_uv);
        if (counter==max) {
          r=0.0;
          g=0.0;
        }
        color=vec3(r,g,b);
  gl_FragColor = vec4(color,1.0);
}
