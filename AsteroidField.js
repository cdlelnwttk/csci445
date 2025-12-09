import * as three from './files/three.module.js';
export class AsteroidField
{
    constructor(vShader, fShader, texture, noise, radius, numberOfAsteroids, numberOfParticles) 
    {
        const data = this.addAsteroidField(vShader, fShader, radius, numberOfAsteroids, texture, noise);
        this.asteroidBelt = data.points;
        this.asteroidBeltMaterial = data.mat;
        this.particleBelt = this.addDustParticles(radius, numberOfParticles)

    }

    addAsteroidField(vShader, fShader, givenRadius, numberOfAsteroids, texture, noise){
        
        const number_of_asteroids = numberOfAsteroids;
        const asteroid_positions = new Float32Array(number_of_asteroids * 3);
        const angles = new Float32Array(number_of_asteroids);
        const offsets = new Float32Array(number_of_asteroids);
        const speeds = new Float32Array(number_of_asteroids);
        for (let i = 0; i < number_of_asteroids; i++) {
            angles[i] = Math.random() * 2 * Math.PI;
            offsets[i] = (Math.random() - 0.5) * 100;
            speeds[i] = (Math.random()) * 2;
        }

        const asteroid_geo = new three.BufferGeometry();

        asteroid_geo.setAttribute('position', new three.BufferAttribute(asteroid_positions, 3));
        asteroid_geo.setAttribute('angle', new three.BufferAttribute(angles, 1));
        asteroid_geo.setAttribute('offset', new three.BufferAttribute(offsets, 1));
        asteroid_geo.setAttribute('speed', new three.BufferAttribute(speeds, 1));


        const asteroid_mat = new three.ShaderMaterial({
            vertexShader: vShader,
            fragmentShader: fShader,
            uniforms: {
                radius: { value: givenRadius },
                size: { value: 10.0 },
                map: { value: texture },
                time: {value: 0.0},
                noise: {value: noise}
            },
            transparent : true,
        });

        let points = new three.Points(asteroid_geo, asteroid_mat);
        return { points, mat: asteroid_mat };
    }


    addDustParticles(radius, numberOfParticles){
        const positions = new Float32Array(numberOfParticles * 3);
    
        for (let i = 0; i < numberOfParticles; i++) {
            const angle = Math.random() * 360 * (Math.PI / 180);

            const radius_of_belt = radius;
            const thickness_of_ring = 100.0;
            const location = (Math.random() - 0.5) * thickness_of_ring;

            const x = Math.cos(angle) * (radius_of_belt + location);
            const y = 0.0;
            const z = Math.sin(angle) * (radius_of_belt + location);
    
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
    }      
        const geometry = new three.BufferGeometry();
        geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
        const material = new three.PointsMaterial({
            size: 0.4,
            color: 0xFFFFFF,
            opacity: 0.1,
        });

        return new three.Points(geometry, material);
    }
}
