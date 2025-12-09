
    import * as three from 'three';
    import { FlyControls } from 'three/addons/FlyControls.js';
    import { EffectComposer } from 'three/addons/EffectComposer.js';
    import { RenderPass } from 'three/addons/RenderPass.js';
    import { UnrealBloomPass } from 'three/addons/UnrealBloomPass.js';
    import { Planet } from './Planet.js';
    import { AsteroidField } from './AsteroidField.js';

    let camera, scene, renderer, controls, composer;
    const clock = new three.Clock();
    let initialCameraZ = 1500;
    let baseSize = 30;

    async function getFileContents(filename){
      return fetch(filename)
        .then((response)=>response.text())
        .then((text)=>{return text});
    }
    const textureLoader = new three.TextureLoader();

    const asteroidTexture = new three.TextureLoader().load('./planets/asteroid.jpg');
    const noisePerlin = new three.TextureLoader().load('./perlin_noise.png')
    const noiseSimplex = textureLoader.load('./simplex_noise.png');
    const background = textureLoader.load('./stars.jpg');

    const genericVertex = await getFileContents("./shaders/vertexShader.glsl");

    const planetFragment = await getFileContents("./shaders/planetFragment.glsl");
    const ringFragment = await getFileContents("./shaders/ringFragment.glsl");
    const glowFragment = await getFileContents("./shaders/glowFragment.glsl");


    const backgroundVertex = await getFileContents("./shaders/backgroundVertex.glsl");
    const backgroundFragment = await getFileContents("./shaders/backgroundFragment.glsl");


    const sunEffectsVertex = await getFileContents("./shaders/sunEffectsVertex.glsl");
    const sunEffectsFragment = await getFileContents("./shaders/sunEffectsFragment.glsl");

    const asteroidVertex = await getFileContents("./shaders/asteroidVertex.glsl");
    const asteroidFragment = await getFileContents("./shaders/asteroidFragment.glsl");

    function addSunEffects()
    {
        
        const geometry = new three.SphereGeometry(40, 128, 128);
    
        const material = new three.ShaderMaterial(
            {
                uniforms: 
                {
                    spikeHeight: { value: 20.0 },
                    spikeFreq: { value: 50.0 } ,
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

    function addBack()
    {
        const numberOfParticles = 8000;
        const radius = 200;
        const positions = new Float32Array(numberOfParticles * 3);
        
        const volumeSize = 4000;

        for (let i = 0; i < numberOfParticles; i++) {
            const x = (Math.random() - 0.5) * volumeSize;
            const y = (Math.random() - 0.5) * volumeSize;
    
            const z = (Math.random() - 0.5) * volumeSize;
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        } 
            const geometry = new three.BufferGeometry();
            geometry.setAttribute("position", new three.BufferAttribute(positions, 3));

        const material = new three.ShaderMaterial(
            {
                vertexShader: backgroundVertex,
                fragmentShader: backgroundFragment,
                uniforms: 
                {
                    time: { value: 0.0 },
                    noise: {value: noiseSimplex},
                    color: {value: new three.Color( 0xFFFFFF)},
                    size: {value: 5.0}
                },
                side: three.DoubleSide,
                blending: three.AdditiveBlending,
                transparent: true,
                depthWrite: false,
                blending: three.AdditiveBlending
            });

            return new three.Points(geometry, material);
    }
    const planets = {
    sun: {
        texture: textureLoader.load('./planets/sun.jpg'),
        position: new three.Vector3(0, 0, 0),
        size: 40.0,
        speed: 0.0005,
        rotation: 0
    },
    mercury: {
        texture: textureLoader.load('./planets/mercury.jpg'),
        position: new three.Vector3(0, 0, 100.0),
        size: 10.0,
        speed: 0.002,
        rotation: 98 * Math.PI / 180

    },
    venus: {
        texture: textureLoader.load('./planets/venus.jpg'),
        position: new three.Vector3(0, 0, 140.0),
        size: 13.0,
        speed: 0.003,
        rotation: 174 * Math.PI / 180
    },
    earth: {
        texture: textureLoader.load('./planets/earth.jpg'),
        position: new three.Vector3(0, 0, 170.0),
        size: 13.0,
        speed: 0.0025,
        rotation: 24 * Math.PI / 180
    },
    mars: {
        texture: textureLoader.load('planets/mars.jpg'),
        position: new three.Vector3(0, 0, 200.0),
        size: 11.0,
        speed: 0.002,
        rotation: 25 * Math.PI / 180
    },
    jupiter: {
        texture: textureLoader.load('planets/jupiter.jpg'),
        position: new three.Vector3(0, 0, 300.0),
        size: 20.0,
        speed: 0.01,
        rotation: 3 * Math.PI / 180
    },
    saturn: {
        texture: textureLoader.load('planets/saturn.jpg'),
        position: new three.Vector3(0, 0, 370.0),
        size: 18.0,
        speed: 0.005,
        rotation: 27 * Math.PI / 180
    },
    uranus: {
        texture: textureLoader.load('planets/uranus.jpg'),
        position: new three.Vector3(0, 0, 440.0),
        size: 16.0,
        speed: 0.001,
        rotation: 98 * Math.PI / 180
    },
    neptune: {
        texture: textureLoader.load('planets/neptune.jpg'),
        position: new three.Vector3(0, 0, 500.0),
        size: 15.0,
        speed: 0.002,
        rotation: 28 * Math.PI / 180
    }
};  
    const planetObjects = {};
    for (let name in planets)
    {
        let newPlanet = new Planet(name, planets[name], genericVertex, planetFragment);
        planetObjects[name] = newPlanet;
    }


    const sun = planetObjects["sun"];
    const sunEffect = addSunEffects();
    const planetPivots = {};
    const asteroidBelt = new AsteroidField(asteroidVertex, asteroidFragment, asteroidTexture, noisePerlin, 250, 300, 5000);
    const keplerBelt = new AsteroidField(asteroidVertex, asteroidFragment, asteroidTexture, noisePerlin, 550, 300, 5000);
    const test = addBack();
    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 25, (window.innerWidth / window.innerHeight), 0.1, 10000);
        camera.position.z = 100;
        camera.position.set(0, 2000, initialCameraZ);
        camera.lookAt(new three.Vector3(0, 0, 0));
    

        renderer = new three.WebGLRenderer({ antialias: true, canvas: can });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);

        scene = new three.Scene();

        controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 800;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;
        // scene.background = background;
        scene.add(sun.planet);
        scene.add(sunEffect);
        scene.add(asteroidBelt.asteroidBelt);
        scene.add(asteroidBelt.particleBelt);
        scene.add(keplerBelt.asteroidBelt);
        scene.add(keplerBelt.particleBelt);
        for (let name in planets)
        {
            if (name == "sun") continue; 
            sun.planet.add(planetObjects[name].pivot);
        }
        planetObjects["saturn"].addRings(
            0xC4A484, 0.3, 50.0, 1.0, 12.0, 15.0, genericVertex, ringFragment);

        planetObjects["saturn"].addGlow(genericVertex, glowFragment, 0xD2B48C, 10.0, 5.0);

        scene.add(test);
        const axisBox = document.getElementById('showAxis');
        axisBox.addEventListener('change', () => 
            {
                for (let name in planets)
                {
                    planetObjects[name].axis.visible = axisBox.checked;
                }
            });

        const orbitBox = document.getElementById('showOrbit');
        orbitBox.addEventListener('change', () =>
            {
                for (let name in planets)
                {
                    planetObjects[name].orbitPath.visible = orbitBox.checked;
                }
            });
        
        const labelBox = document.getElementById('showLabels');
        labelBox.addEventListener('change', () =>
            {
                for (let name in planets)
                {
                    planetObjects[name].label.visible = labelBox.checked;
                }
            });

        window.addEventListener('resize', () => 
            {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);

            });

        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        const bloomPass = new UnrealBloomPass({ x: window.innerWidth, y: window.innerHeight }, 2.2, 1.5, 0.5);
        composer.addPass(bloomPass);
}


    function animate() {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render( scene, camera );
        composer.render();
        planetObjects.sun.mesh.rotation.y += 0.01;
        const currentCameraZ = camera.position.z
        const zoomFactor = currentCameraZ / initialCameraZ;
        for (let name in planets)
        {
            planetObjects[name].pivot.rotation.y += planets[name].speed * 2.0;
            planetObjects[name].mesh.rotation.y += planets[name].speed * 6.0;
            if (planetObjects[name].label.visible)
            {
                const newScale = zoomFactor * baseSize;
                planetObjects[name].label.scale.set(newScale, newScale, newScale);
            }
        }
        sunEffect.rotation.y += 0.01;
        sunEffect.material.uniforms.time.value = clock.getElapsedTime();
        asteroidBelt.particleBelt.rotation.y+= 0.3;
        asteroidBelt.asteroidBeltMaterial.uniforms.time.value = clock.getElapsedTime();
        keplerBelt.particleBelt.rotation.y+= 0.3;
        test.material.uniforms.time.value = clock.getElapsedTime();
        keplerBelt.asteroidBeltMaterial.uniforms.time.value = clock.getElapsedTime();

    };

    window.onload=init();
