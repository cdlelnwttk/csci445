
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
        position: new three.Vector3(3, 0, 0),
        size: 0.3,

    },
    venus: {
        texture: textureLoader.load('planets/venus.jpg'),
        position: new three.Vector3(5, 0, 0),
        size: 0.5,
    },
    earth: {
        texture: textureLoader.load('planets/earth.jpg'),
        position: new three.Vector3(7, 0, 0),
        size: 0.5,
    },
    mars: {
        texture: textureLoader.load('planets/mars.jpg'),
        position: new three.Vector3(9, 0, 0),
        size: 0.4,
    },
    jupiter: {
        texture: textureLoader.load('planets/jupiter.jpg'),
        position: new three.Vector3(12, 0, 0),
        size: 1.0,
    },
    saturn: {
        texture: textureLoader.load('planets/saturn.jpg'),
        position: new three.Vector3(15, 0, 0),
        size: 0.9,
    },
    uranus: {
        texture: textureLoader.load('planets/uranus.jpg'),
        position: new three.Vector3(18, 0, 0),
        size: 0.7,
    },
    neptune: {
        texture: textureLoader.load('planets/neptune.jpg'),
        position: new three.Vector3(21, 0, 0),
        size: 0.7,
    }
};  
   const planetMeshes = {}; 

    for (let name in planets) {
        const data = planets[name];

        const geometry = new three.SphereGeometry(data.size, 32, 32);
        const material = new three.MeshBasicMaterial({ map: data.texture });
        const mesh = new three.Mesh(geometry, material);

        mesh.position.copy(data.position);

        planetMeshes[name] = mesh;
    }

    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 10, (window.innerWidth / window.innerHeight), 0.1, 10000);
        camera.position.z = 100;
        camera.position.set(0, 100, 100);
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
        scene.add(planetMeshes.mercury);
        scene.add(planetMeshes.venus);
        scene.add(planetMeshes.earth);
        scene.add(planetMeshes.mars);
        scene.add(planetMeshes.jupiter);
        scene.add(planetMeshes.saturn);
        scene.add(planetMeshes.uranus);
        scene.add(planetMeshes.neptune);

        window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('wheel', (event) => {
            camera.translateZ(event.deltaY * 0.05); // adjust 0.05 for speed
        });
        });
    }

    function animate() {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render( scene, camera );
        planetMeshes.sun.rotation.y += 0.01; 
        // controls.update(time);

    }

    window.onload=init();
