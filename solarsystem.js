
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


    const noiseSimplex = new three.TextureLoader().load('simplex_noise.png')
    const spikeV=await getFileContents("./spikeVertex.glsl");
    const spikeF=await getFileContents("./spikefrag.glsl");
    const glowV =await getFileContents("./glowShader.glsl");
    const fontJsonStr = await getFileContents("./font.typeface.json");
    const font = new FontLoader().parse(JSON.parse(fontJsonStr));
    noiseSimplex.wrapS = three.RepeatWrapping;
    noiseSimplex.wrapT = three.RepeatWrapping;
    noiseSimplex.minFilter = three.LinearFilter;
    noiseSimplex.magFilter = three.LinearFilter;

    //PLANET RELATED FUNCTIONS 
    function addAxis(length)
    {
        const axis = new three.Object3D();
        const points = [
            new three.Vector3(0, -length, 0),
            new three.Vector3(0,  length, 0)
    ];

        const geometry = new three.BufferGeometry().setFromPoints(points);
        const material = new three.LineBasicMaterial({color: 0x00ff00});
        const axisLine = new three.Line(geometry, material);

        axis.add(axisLine);
        return axis;
    }

    function addOrbitPath(radius)
    {
        const path = new three.Object3D();

        const geometry = new three.TorusGeometry(radius, 0.1, 60, 100);
        const material = new three.MeshBasicMaterial(
            {   
                color: 0xffffff, 
                transparent: true, 
                opacity: 1.0
            });

        const mesh = new three.Mesh(geometry, material);

        mesh.rotation.x = Math.PI / 2;
        path.add(mesh);
        return path;
    }

    //FIX Y POSITION
    function addLabel(name)
    {
        // const object = new three.Object3D();
        // const geometry = new TextGeometry(name,
        //     {
	    //         font: font,
	    //         size: 8,
	    //         depth: 2,
	    //         curveSegments: 12,
        //         transparent: true,
        //     });
        // const material = new three.MeshBasicMaterial({ color: 0xffffff });
        // const mesh = new three.Mesh(geometry, material);

        // const outlineMaterial = new three.MeshBasicMaterial({ color: 0x800080, transparent: true, opacity: 0.4});
        // const outlineMesh = new three.Mesh(geometry.clone(), outlineMaterial);
        // outlineMesh.scale.multiplyScalar(1.01);


        // mesh.rotation.x = -Math.PI / 2; 
        // outlineMesh.rotation.x = -Math.PI / 2; 

        // object.add(mesh);
        // object.add(outlineMesh);
        // return object;
           const canvas = document.createElement('canvas');
    const size = 3000;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    ctx.font = '800px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 100;          
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
    sprite.scale.set(30, 30, 1);
    sprite.position.y += 20;
    return sprite;
    }

    

    const geometrySpike = new three.SphereGeometry(1, 128, 128);
    
    const materialSpike = new three.ShaderMaterial({
        uniforms: {
            spikeHeight: { value: 20.0 },
            spikeFreq: { value: 20.0 } ,
            time: { value: 0.0 },
            noise: {value: noiseSimplex}
        },
        vertexShader: spikeV,
        fragmentShader: spikeF,
        side: three.DoubleSide,
        blending: three.AdditiveBlending
    });
    
    const spike = new three.Mesh(geometrySpike, materialSpike);

    const vertexShaderSource=await getFileContents("./vertexShader.glsl");
    const fragmentShaderSource=await getFileContents("./ringFragment.glsl");

    const asteroidVertex=await getFileContents("./asteroidVertex.glsl");
    const asteroidFragment=await getFileContents("./asteroidFragment.glsl");

    const asteroidTexture = new three.TextureLoader().load('planets/asteroid.jpg');
    const noiseTexture = new three.TextureLoader().load('perlin_noise.png')
    const asteroid_fields = [];

    function addAsteroidField(givenRadius, numberOfAsteroids){
        
        const number_of_asteroids = numberOfAsteroids;
        const asteroid_positions = new Float32Array(number_of_asteroids * 3);
        const angles = new Float32Array(number_of_asteroids);
        const offsets = new Float32Array(number_of_asteroids);
        const speeds = new Float32Array(number_of_asteroids);
        for (let i = 0; i < number_of_asteroids; i++) {
            angles[i] = Math.random() * 2 * Math.PI;
            offsets[i] = (Math.random() - 0.5) * 20;
            speeds[i] = (Math.random()) * 2;
        }

        const asteroid_geo = new three.BufferGeometry();

        asteroid_geo.setAttribute('position', new three.BufferAttribute(asteroid_positions, 3));
        asteroid_geo.setAttribute('angle', new three.BufferAttribute(angles, 1));
        asteroid_geo.setAttribute('offset', new three.BufferAttribute(offsets, 1));
        asteroid_geo.setAttribute('speed', new three.BufferAttribute(speeds, 1));


        const asteroid_mat = new three.ShaderMaterial({
            vertexShader: asteroidVertex,
            fragmentShader: asteroidFragment,
            uniforms: {
                radius: { value: givenRadius },
                size: { value: 10.0 },
                map: { value: asteroidTexture },
                time: {value: 0.0},
                noise: {value: noiseTexture}
            },
            transparent : true,
        });

        let points = new three.Points(asteroid_geo, asteroid_mat);
        return { points, mat: asteroid_mat };
    }


    function addDustParticles(radius){
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
    
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * 360 * (Math.PI / 180);

            const radius_of_belt = radius;
            const thickness_of_ring = 14.0;
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

    const planets = {
    sun: {
        texture: textureLoader.load('planets/sun.jpg'),
        position: new three.Vector3(0, 0, 0),
        size: 10.0,
    },
    mercury: {
        texture: textureLoader.load('planets/mercury.jpg'),
        position: new three.Vector3(0, 0, 17.0),
        size: 2.0,
        speed: 0.05,
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
        speed: 0.000005,
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

const ringGeometry = new three.RingGeometry(12.0, 15.0)
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


    const planetLabels = {};
    const asteroid_belt = addAsteroidField(60, 500);
    const kepler_belt = addAsteroidField(150, 1000);
    asteroid_fields.push(asteroid_belt);
    const dust = addDustParticles(60);
    const kepler_dust = addDustParticles(150);

      const glowMat = new three.ShaderMaterial({
            vertexShader: vertexShaderSource,
            fragmentShader: glowV,
            uniforms: {
                glowColor: { value: new three.Color(0xFFC000) },
                intensity: { value: 1.0 },
                radius: { value: 0.6},
                blur: { value: 0.8 },
      },
        transparent: true,
         depthWrite: false,
         side: three.DoubleSide,
         additiveBlending: true,
    });

    const sun = planetObjects["sun"];
    const planetPivots = {};
    // sun.axis.visible = false;
    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 25, (window.innerWidth / window.innerHeight), 0.1, 10000);
        camera.position.z = 100;
        camera.position.set(0, 500, 400);
        camera.lookAt(new three.Vector3(0, 0, 0));
    

        renderer = new three.WebGLRenderer({ antialias: true, canvas: can });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);

        scene = new three.Scene();


        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        const bloomPass = new UnrealBloomPass({ x: window.innerWidth, y: window.innerHeight }, 0.3, 1.0, 0.00);
        bloomPass.clearColor = new three.Color(0x220011); 
        composer.addPass(bloomPass);

        controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 120;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;

        scene.add(sun.object);
        for (let name in planets)
        {
            if (name == "sun") continue;
            const pivot = new three.Object3D();
            pivot.add(planetObjects[name].object);
            sun.object.add(pivot);

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
            }
            });

        const checkboxLabel = document.getElementById('showLabels');
        checkboxLabel.addEventListener('change', () => {
            for (let name in planetLabels) {
                planetLabels[name].visible = checkboxLabel.checked;
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
        // composer.render();
        // composer.render();
        // planetMeshes.sun.rotation.y += 0.01; 
        // for (let name in planetPivots)
        // {
        //     planetPivots[name].rotation.y += planets[name].speed;
        //     planetMeshes[name].rotation.y += 0.5;
        // }
        // asteroid_belt.mat.uniforms.time.value = clock.getElapsedTime();
        // spike.materialSpike.time += 0.001;
    };

    window.onload=init();
