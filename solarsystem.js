
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

    const textureLoader = new three.TextureLoader();

    const planets = {
    sun: {
        texture: textureLoader.load('planets/sun.jpg'),
        position: new three.Vector3(0, 0, 0),
        size: 2.0,
    },
    mercury: {
        texture: textureLoader.load('planets/mercury.jpg'),
        position: new three.Vector3(0, 0, 4),
        size: 0.5,
        speed: 0.01,
        rotation: 98 * Math.PI / 180

    },
    venus: {
        texture: textureLoader.load('planets/venus.jpg'),
        position: new three.Vector3(0, 0, 6),
        size: 0.5,
        speed: 0.01,
        rotation: 174 * Math.PI / 180
    },
    earth: {
        texture: textureLoader.load('planets/earth.jpg'),
        position: new three.Vector3(0, 0, 8),
        size: 0.5,
        speed: 0.01,
        rotation: 24 * Math.PI / 180
    },
    mars: {
        texture: textureLoader.load('planets/mars.jpg'),
        position: new three.Vector3(0, 0, 10),
        size: 0.4,
        speed: 0.01,
        rotation: 25 * Math.PI / 180
    },
    jupiter: {
        texture: textureLoader.load('planets/jupiter.jpg'),
        position: new three.Vector3(0, 0, 12),
        size: 1.0,
        speed: 0.01,
        rotation: 3 * Math.PI / 180
    },
    saturn: {
        texture: textureLoader.load('planets/saturn.jpg'),
        position: new three.Vector3(0, 0, 15),
        size: 0.9,
        speed: 0.01,
        rotation: 27 * Math.PI / 180
    },
    uranus: {
        texture: textureLoader.load('planets/uranus.jpg'),
        position: new three.Vector3(0, 0, 18),
        size: 0.7,
        speed: 0.01,
        rotation: 98 * Math.PI / 180
    },
    neptune: {
        texture: textureLoader.load('planets/neptune.jpg'),
        position: new three.Vector3(0, 0, 21),
        size: 0.7,
        speed: 0.01,
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
    // const orbitTorus = new three.TorusGeometry(1, 0.01, 16, 100);
    // const orbitMaterial = new three.MeshBasicMaterial({ color: 0xffffff });
    // const orbitMesh = new three.Mesh(orbitTorus, orbitMaterial);


    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 10, (window.innerWidth / window.innerHeight), 0.1, 10000);
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
        }


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
