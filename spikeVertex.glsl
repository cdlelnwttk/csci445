varying vec3 our_uv;

// uniform float spikeHeight; // max spike height
// uniform float spikeFreq;   // frequency of spikes
// uniform float time;        // time for animation

// // simple hash function for per-vertex randomness
// float hash(vec3 p){
//     return fract(sin(dot(p ,vec3(12.9898,78.233,45.164)))*43758.5453);
// }

// void main() {
//     our_uv = position;

//     // random spike height per vertex
//     float randHeight = hash(position) * spikeHeight;
//     vec3 freqs = vec3(spikeFreq * 4.0);
//     float baseSpike = cos(position.x * freqs.x + time * 2.0) *
//                       cos(position.y * freqs.y + time) *
//                       cos(position.z * freqs.z + time);

//     float flicker = 0.9 + 0.2 * sin(time * 10.0 + hash(position) * 10.0);

//     float spike = baseSpike * randHeight * flicker;
//     vec3 dir = normalize(position);
//     vec3 newPos = position + dir * spike;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
// }

uniform float spikeHeight;
uniform float spikeFreq;
uniform float time;

void main() {
    our_uv = position;
    float spike = (cos(position.x * spikeFreq * 4.0 + time * 20.0) * 
                  cos(position.y * spikeFreq * 4.0 + time * 20.0) * 
                  cos(position.z * spikeFreq * 4.0 + time * 10.0) * spikeHeight);

    vec3 newPos = position + normalize(position) * spike;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
