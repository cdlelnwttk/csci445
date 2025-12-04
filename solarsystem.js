
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';
    import { FlyControls } from 'three/addons/FlyControls.js';
    let camera, scene, renderer, controls;
    const clock = new three.Clock();

    async function getFileContents(filename){
      return fetch(filename)
        .then((response)=>response.text())
        .then((text)=>{return text});
    }

    const vertexShaderSource=await getFileContents("./vertexShader.glsl");
    const fragmentShaderSource=await getFileContents("./ringFragment.glsl");
    const textureLoader = new three.TextureLoader();

    const planets = {
    sun: {
        texture: textureLoader.load('planets/sun.jpg'),
        position: new three.Vector3(0, 0, 0),
        size: 3.0,
    },
    mercury: {
        texture: textureLoader.load('planets/mercury.jpg'),
        position: new three.Vector3(0, 0, 5.0),
        size: 0.75,
        speed: 0.05,
        rotation: 98 * Math.PI / 180

    },
    venus: {
        texture: textureLoader.load('planets/venus.jpg'),
        position: new three.Vector3(0, 0, 8.0),
        size: 1,
        speed: 0.03,
        rotation: 174 * Math.PI / 180
    },
    earth: {
        texture: textureLoader.load('planets/earth.jpg'),
        position: new three.Vector3(0, 0, 11.0),
        size: 1,
        speed: 0.025,
        rotation: 24 * Math.PI / 180
    },
    mars: {
        texture: textureLoader.load('planets/mars.jpg'),
        position: new three.Vector3(0, 0, 15.0),
        size: 0.8,
        speed: 0.02,
        rotation: 25 * Math.PI / 180
    },
    jupiter: {
        texture: textureLoader.load('planets/jupiter.jpg'),
        position: new three.Vector3(0, 0, 22.0),
        size: 2.0,
        speed: 0.01,
        rotation: 3 * Math.PI / 180
    },
    saturn: {
        texture: textureLoader.load('planets/saturn.jpg'),
        position: new three.Vector3(0, 0, 28.0),
        size: 1.8,
        speed: 0.005,
        rotation: 27 * Math.PI / 180
    },
    uranus: {
        texture: textureLoader.load('planets/uranus.jpg'),
        position: new three.Vector3(0, 0, 33.0),
        size: 1.6,
        speed: 0.001,
        rotation: 98 * Math.PI / 180
    },
    neptune: {
        texture: textureLoader.load('planets/neptune.jpg'),
        position: new three.Vector3(0, 0, 38.0),
        size: 1.5,
        speed: 0.000005,
        rotation: 28 * Math.PI / 180
    }
};  
   const planetMeshes = {}; 

    for (let name in planets) {

        const geometry = new three.SphereGeometry(planets[name].size, 32, 32);
        const material = new three.MeshBasicMaterial({ map: planets[name].texture });
        const mesh = new three.Mesh(geometry, material);
        mesh.position.copy(planets[name].position);
        planetMeshes[name] = mesh;
    }

    const planetOrbits = {}

    function addZAxis(object, length) {
        const points = [
            new three.Vector3(0, -length, 0),
            new three.Vector3(0,  length, 0)
        ];

        const geometry = new three.BufferGeometry().setFromPoints(points);
        const material = new three.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1.0});
        const line = new three.Line(geometry, material);

        object.add(line);
        return line;
        }

    function addOrbitLine(radius) {
        const orbitTorus = new three.TorusGeometry(radius, 0.01, 16, 100);
        const orbitMaterial = new three.MeshBasicMaterial({ color: 0xffffff , transparent: true, opacity: 1.0});
        const orbitMesh = new three.Mesh(orbitTorus, orbitMaterial);
        orbitMesh.rotation.x = Math.PI / 2;
        return orbitMesh;
    }

    const planetAxes = {};
    const planetOrbitLines = {}

    // const saturnRingGeometry = new three.RingGeometry(1.1, 1.5, 64);
    // const saturnRingMaterial = new three.MeshBasicMaterial({color: 0x7B3F00, side: three.DoubleSide,   transparent: true, opacity: 1.0});
    // const saturnRingMesh = new three.Mesh(saturnRingGeometry, saturnRingMaterial);

    const ringMaterial = new three.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    uniforms: {
        ringColor: { value: new three.Color(0xC4A484) },
        offset: {value : 0.3},
        frequency: {value: 50.0},
        opacity: { value: 1.0 }
    },
    transparent: true,
    side: three.DoubleSide
});

const ringGeometry = new three.RingGeometry(3.0, 2.4)
const saturnRingMesh = new three.Mesh(ringGeometry, ringMaterial);
saturnRingMesh.rotation.x = Math.PI / 2;




  const jupRMaterial = new three.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    uniforms: {
        ringColor: { value: new three.Color(0xFFFFFF) },
        offset: {value : 0.3},
        frequency: {value: 20.0},
        opacity: { value: 0.25}
    },
    transparent: true,
    side: three.DoubleSide
});

const jupRGeometry = new three.RingGeometry(3.4, 2.2)
const jupRingMesh = new three.Mesh(jupRGeometry, jupRMaterial);

const uranusRMesh = new three.Mesh(jupRGeometry, jupRMaterial);
jupRingMesh.rotation.x = Math.PI / 2;


function createLabel(name) {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 6;          
    ctx.strokeStyle = 'black';
    ctx.strokeText(name, size / 2, size / 2);

    ctx.fillStyle = 'white';
    ctx.fillText(name, size / 2, size / 2);

    const texture = new three.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = three.LinearFilter;
    texture.magFilter = three.LinearFilter;

    const material = new three.SpriteMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1, 
        depthTest: true,
        depthWrite: false
    });

    const sprite = new three.Sprite(material);
    sprite.scale.set(10, 10, 1);
    return sprite;
}

    const planetLabels = {};
    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 25, (window.innerWidth / window.innerHeight), 0.1, 10000);
        camera.position.z = 100;
        camera.position.set(0, 120, 100);
        camera.lookAt(new three.Vector3(0, 0, 0));
    

        renderer = new three.WebGLRenderer({ antialias: true, canvas: can });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);
        
        controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 10;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;

        scene = new three.Scene();
        scene.add(planetMeshes.sun);
        let sunLabel = createLabel("Sun");
        sunLabel.position.set(0, planets.sun.size + 2, 0);
        planetLabels["Sun"] = sunLabel;
        planetMeshes.sun.add(sunLabel);

        for (let name in planets) {
            if (name === "sun") continue;

            let orbit = new three.Object3D();
            planetMeshes.sun.add(orbit);
            orbit.add(planetMeshes[name]);
            planetOrbits[name] = orbit;

            let axis = addZAxis(planetMeshes[name], planets[name].size * 3);
            planetAxes[name] = axis; 
            planetMeshes[name].rotation.z = planets[name].rotation;

            const radius = planets[name].position.z;
            const orbitMesh = addOrbitLine(radius);
            planetOrbitLines[name] = orbitMesh;
            planetMeshes.sun.add(orbitMesh);

            let label = createLabel(name);
            label.position.set(0, planets[name].size + 2, 0);
            planetLabels[name] = label;
            planetMeshes[name].add(label);
        }

        planetMeshes.saturn.add(saturnRingMesh);
        planetMeshes.jupiter.add(jupRingMesh);
        planetMeshes.uranus.add(uranusRMesh);
        const checkbox = document.getElementById('showAxis');
        checkbox.addEventListener('change', () => {
            for (let name in planetAxes) {
                planetAxes[name].visible = checkbox.checked;
            }
            });

        const checkboxOrbit = document.getElementById('showOrbit');
        checkboxOrbit.addEventListener('change', () => {
            for (let name in planetAxes) {
                planetOrbitLines[name].visible = checkboxOrbit.checked;
                planetMeshes.sun.add(planetOrbitLines[name]);
            }
            });
        window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('wheel', (event) => {
            camera.translateZ(event.deltaY * 0.05);
        });
        });
    }

    function animate() {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render( scene, camera );
        planetMeshes.sun.rotation.y += 0.01; 
        for (let name in planetOrbits) {
            planetOrbits[name].rotation.y += planets[name].speed;
        }
    };

    window.onload=init();
