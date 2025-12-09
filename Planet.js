
import * as three from './files/three.module.js';
export class Planet
{
    constructor(name, entry) 
    {
        this.name = name;
        this.planet = new three.Object3D();
        this.pivot = new three.Object3D();

        const geometry = new three.SphereGeometry(entry.size, 32, 32);
        const material = new three.MeshBasicMaterial({ map: entry.texture });
        const mesh = new three.Mesh(geometry, material);
        this.mesh = mesh;
        this.planet.add(this.mesh);

        this.axis = this.addAxis(entry.size * 3);
        this.planet.add(this.axis);

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
        const material = new three.LineBasicMaterial({color: 0x00ff00});
        const axisLine = new three.Line(geometry, material);
    
        return axisLine;
    }

    addOrbitPath(radius)
    {
        const geometry = new three.TorusGeometry(radius, 0.1, 60, 100);
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
    addRings() {}
}
