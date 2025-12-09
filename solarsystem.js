
    import * as three from 'three';
    import { FlyControls } from 'three/addons/FlyControls.js';
    import { TextGeometry } from 'three/addons/TextGeometry.js';
    import { FontLoader } from 'three/addons/FontLoader.js';
    import { Pass } from 'three/addons/Pass.js';
    import { ShaderPass } from 'three/addons/ShaderPass.js'
    import { CopyShader } from 'three/addons/shaders/CopyShader.js'
    import { LuminosityHighPassShader } from 'three/addons/shaders/LuminosityHighPassShader.js'
    import { MaskPass } from 'three/addons/MaskPass.js';
    import { EffectComposer } from 'three/addons/EffectComposer.js';
    import { RenderPass } from 'three/addons/RenderPass.js';
    import { UnrealBloomPass } from 'three/addons/UnrealBloomPass.js';
    import { Planet } from './Planet.js';

    let camera, scene, renderer, controls, composer;
    const clock = new three.Clock();

    async function getFileContents(filename){
      return fetch(filename)
        .then((response)=>response.text())
        .then((text)=>{return text});
    }
    const textureLoader = new three.TextureLoader();

    const noiseSimplex = textureLoader.load('simplex_noise.png');

    const genericVertex = await getFileContents("./shaders/vertexShader.glsl");
    const ringFragment = await getFileContents("./shaders/ringFragment.glsl");

    const sunEffectsVertex = await getFileContents("./shaders/sunEffectsVertex.glsl");
    const sunEffectsFragment = await getFileContents("./shaders/sunEffectsFragment.glsl");

    function addSunEffects()
    {
        
        const geometry = new three.SphereGeometry(40, 128, 128);
    
        const material = new three.ShaderMaterial(
            {
                uniforms: 
                {
                    spikeHeight: { value: 20.0 },
                    spikeFreq: { value: 100.0 } ,
                    time: { value: 0.0 },
                    noise: {value: noiseSimplex}
                },
                vertexShader: sunEffectsVertex,
                fragmentShader: sunEffectsFragment,
                side: three.DoubleSide,
                blending: three.AdditiveBlending
            });
    
        return new three.Mesh(geometry, material);
    }

    const planets = {
    sun: {
        texture: textureLoader.load('planets/sun.jpg'),
        position: new three.Vector3(0, 0, 0),
        size: 40.0,
        speed: 0.0005,
        rotation: 0
    },
    mercury: {
        texture: textureLoader.load('planets/mercury.jpg'),
        position: new three.Vector3(0, 0, 100.0),
        size: 8.0,
        speed: 0.002,
        rotation: 98 * Math.PI / 180

    },
    venus: {
        texture: textureLoader.load('planets/venus.jpg'),
        position: new three.Vector3(0, 0, 28.0),
        size: 3.0,
        speed: 0.03,
        rotation: 174 * Math.PI / 180
    },
    earth: {
        texture: textureLoader.load('planets/earth.jpg'),
        position: new three.Vector3(0, 0, 37.0),
        size: 3.0,
        speed: 0.025,
        rotation: 24 * Math.PI / 180
    },
    mars: {
        texture: textureLoader.load('planets/mars.jpg'),
        position: new three.Vector3(0, 0, 45.0),
        size: 2.5,
        speed: 0.02,
        rotation: 25 * Math.PI / 180
    },
    jupiter: {
        texture: textureLoader.load('planets/jupiter.jpg'),
        position: new three.Vector3(0, 0, 75.0),
        size: 8.0,
        speed: 0.01,
        rotation: 3 * Math.PI / 180
    },
    saturn: {
        texture: textureLoader.load('planets/saturn.jpg'),
        position: new three.Vector3(0, 0, 90.0),
        size: 7.0,
        speed: 0.005,
        rotation: 27 * Math.PI / 180
    },
    uranus: {
        texture: textureLoader.load('planets/uranus.jpg'),
        position: new three.Vector3(0, 0, 110.0),
        size: 6.0,
        speed: 0.001,
        rotation: 98 * Math.PI / 180
    },
    neptune: {
        texture: textureLoader.load('planets/neptune.jpg'),
        position: new three.Vector3(0, 0, 130.0),
        size: 5.5,
        speed: 0.002,
        rotation: 28 * Math.PI / 180
    }
};  
    const planetObjects = {};
    for (let name in planets)
    {
        let newPlanet = new Planet(name, planets[name]);
        planetObjects[name] = newPlanet;
    }

    const planetAxes = {};
    const planetOrbitLines = {}


    const sun = planetObjects["sun"];
    const sunEffect = addSunEffects();
    const planetPivots = {};
    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 25, (window.innerWidth / window.innerHeight), 0.1, 10000);
        camera.position.z = 100;
        camera.position.set(0, 1000, 400);
        camera.lookAt(new three.Vector3(0, 0, 0));
    

        renderer = new three.WebGLRenderer({ antialias: true, canvas: can });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);

        scene = new three.Scene();

        controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 120;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;

        scene.add(sun.planet);
        scene.add(sunEffect);
        for (let name in planets)
        {
            if (name == "sun") continue; 
            sun.planet.add(planetObjects[name].pivot);
        }

        planetObjects["saturn"].addRings(
            0xC4A484, 0.3, 50.0, 1.0, 12.0, 15.0, genericVertex, ringFragment);


        const axisBox = document.getElementById('showAxis');
        axisBox.addEventListener('change', () => 
            {
                for (let name in planets)
                {
                    planetObjects[name].axis.visible = axisBox.checked;
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

        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        const bloomPass = new UnrealBloomPass({ x: window.innerWidth, y: window.innerHeight }, 0.7, 2.0, 0.00);
        composer.addPass(bloomPass);
    }

    function animate() {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render( scene, camera );
        composer.render();
        planetObjects.sun.mesh.rotation.y += 0.01;
        for (let name in planets)
        {
            planetObjects[name].pivot.rotation.y += planets[name].speed * 2.0;
            planetObjects[name].mesh.rotation.y += planets[name].speed * 6.0;
        }
        sunEffect.rotation.y += 0.01;
        sunEffect.material.uniforms.time.value = clock.getElapsedTime();
    };

    window.onload=init();
