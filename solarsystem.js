
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
        speed: 0.02

    },
    venus: {
        texture: textureLoader.load('planets/venus.jpg'),
        position: new three.Vector3(0, 0, 6),
        size: 0.5,
        speed: 0.015
    },
    earth: {
        texture: textureLoader.load('planets/earth.jpg'),
        position: new three.Vector3(0, 0, 8),
        size: 0.5,
        speed: 0.02
    },
    mars: {
        texture: textureLoader.load('planets/mars.jpg'),
        position: new three.Vector3(0, 0, 10),
        size: 0.4,
        speed: 0.018
    },
    jupiter: {
        texture: textureLoader.load('planets/jupiter.jpg'),
        position: new three.Vector3(0, 0, 12),
        size: 1.0,
        speed: 0.05
    },
    saturn: {
        texture: textureLoader.load('planets/saturn.jpg'),
        position: new three.Vector3(0, 0, 15),
        size: 0.9,
        speed: 0.04
    },
    uranus: {
        texture: textureLoader.load('planets/uranus.jpg'),
        position: new three.Vector3(0, 0, 18),
        size: 0.7,
        speed: 0.03
    },
    neptune: {
        texture: textureLoader.load('planets/neptune.jpg'),
        position: new three.Vector3(0, 0, 21),
        size: 0.7,
        speed: 0.025
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
        // scene.add(planetMeshes.mercury);
        // scene.add(planetMeshes.venus);
        scene.add(planetMeshes.earth);
        scene.add(planetMeshes.mars);
        scene.add(planetMeshes.jupiter);
        scene.add(planetMeshes.saturn);
        scene.add(planetMeshes.uranus);
        scene.add(planetMeshes.neptune);

        // const mercPivot = new three.Object3D();
        // planetMeshes.sun.add(mercPivot);
        // mercPivot.add(planetMeshes.mercury);

        // const venusPivot = new three.Object3D();
        // planetMeshes.sun.add(venusPivot);
        // venusPivot.add(planetMeshes.venus);

        for (let name in planets) {
            if (name === "sun") continue;
            let orbit = new three.Object3D();
            planetMeshes.sun.add(orbit);
            orbit.add(planetMeshes[name]);
            planetOrbits[name] = orbit;
        }

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
