
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';

    let camera, scene, renderer,controls;
    
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
        camera = new three.PerspectiveCamera( 100, (window.innerWidth / window.innerHeight), 0.1, 100 );
        camera.position.z = 100;

    

        renderer = new three.WebGLRenderer({ antialias: true, canvas: can });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);
        controls = new OrbitControls( camera, renderer.domElement );
    
        controls.enableDamping = true;
        controls.minDistance = 1;
        controls.maxDistance = 10;
 
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
        });
    }

    function animate() {
        controls.update();
        renderer.render( scene, camera );
        planetMeshes.sun.rotation.y += 0.01; 

    }

    window.onload=init();
