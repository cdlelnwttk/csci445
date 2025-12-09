import * as three from './files/three.module.js';
export class Planet
{
    constructor(name, entry, vShader, fShader) 
    {
        this.name = name;
        this.planet = new three.Object3D();
        this.pivot = new three.Object3D();
        this.tilt = new three.Object3D();
        this.tilt.rotation.z = entry.rotation;

        const geometry = new three.SphereGeometry(entry.size, 32, 32);
        this.geometry = geometry;
        const material = new three.ShaderMaterial(
            {
                vertexShader: vShader, 
                fragmentShader: fShader,
                uniforms: 
                {
                    tex: {value : entry.texture}
                }
            })
        
        const mesh = new three.Mesh(geometry, material);
        mesh.rotation.z = entry.rotation;
        this.mesh = mesh;
    

        this.axis = this.addAxis(entry.size * 3);
        this.axis.rotation.z = entry.rotation;


        this.tilt.add(this.axis);
        this.tilt.add(this.mesh);
        this.planet.add(this.tilt);
        this.orbitPath = this.addOrbitPath(entry.position.z);

        this.label = this.addLabel(name, entry.size * 2);
        this.planet.add(this.label);
        this.planet.position.copy(entry.position);

        this.pivot.position.copy = (0, 0, 0);
        this.pivot.add(this.planet);
        this.pivot.add(this.orbitPath);

    }

    addAxis(length)
    {
        const points = [
            new three.Vector3(0, -length, 0),
            new three.Vector3(0,  length, 0)
        ];
    
        const geometry = new three.BufferGeometry().setFromPoints(points);
        const material = new three.LineBasicMaterial(
            {
                color: 0x00ff00,
                transparent: true,
                opacity: 1.0

            });
        const axisLine = new three.Line(geometry, material);
    
        return axisLine;
    }

    addOrbitPath(radius)
    {
        const geometry = new three.TorusGeometry(radius, 0.7, 200, 100);
        const material = new three.MeshBasicMaterial(
                {   
                    color: 0xffffff, 
                    transparent: true, 
                    opacity: 1.0
                });
    
        const mesh = new three.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    addLabel(text, yPos)
    {
        const canvas = document.createElement('canvas');
        const size = 3000;
        canvas.width = size;
        canvas.height = size;

        const dom = canvas.getContext('2d');

        dom.clearRect(0, 0, size, size);

        dom.font = '800px Arial';
        dom.textAlign = 'center';
        dom.textBaseline = 'middle';

        dom.lineWidth = 100;          
        dom.strokeStyle = 'black';
        dom.strokeText(text, size / 2, size / 2);

        dom.fillStyle = 'white';
        dom.fillText(text, size / 2, size / 2);

        const texture = new three.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = three.LinearFilter;
        texture.magFilter = three.LinearFilter;

        const material = new three.SpriteMaterial(
        {
            map: texture,
            transparent: true,
            alphaTest: 0.1, 
            depthTest: true,
            depthWrite: false
        });

        const sprite = new three.Sprite(material);
        sprite.scale.set(30, 30, 1);
        sprite.position.y += yPos;
        return sprite;
    }

    addRings(color, offset, frequency, opacity, innerRing, outerRing, vShader, fShader) 
    {
        const material = new three.ShaderMaterial(
            {
                vertexShader: vShader,
                fragmentShader: fShader,
                uniforms: 
                {
                    ringColor: { value: new three.Color(color) },
                    offset: {value : offset},
                    frequency: {value: frequency},
                    opacity: { value: opacity }
                },
                transparent: true,
                side: three.DoubleSide
            });

        const geometry = new three.RingGeometry(innerRing, outerRing)
        const mesh = new three.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        this.tilt.add(mesh);
    }

    addGlow(vShader, fShader, color, opacity, size)
    {
        const material = new three.ShaderMaterial(
            {
            vertexShader: vShader,
            fragmentShader: fShader,
            uniforms: {
                color: { value: new three.Color(color)},
                opacity: { value: opacity},
                radius: {value: this.mesh.geometry.parameters.radius + size}
            },
            transparent: true,
            depthWrite: false,
            side: three.DoubleSide,
            blending: three.AdditiveBlending
        });

        const geometry = this.mesh.geometry;
        const mesh = new three.Mesh(geometry, material);
        this.tilt.add(mesh);
    }
}
