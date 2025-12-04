
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';

    let camera, scene, renderer,controls;
    
    async function getFileContents(filename){
      return fetch(filename)
        .then((response)=>response.text())
        .then((text)=>{return text});
    }

    const textureLoader = new three.TextureLoader();
    const sunTexture = textureLoader.load('./sun.jpg');

    const vertexShaderSource=await getFileContents("./vertexShader.glsl");
    const fragmentShaderSource=await getFileContents("./fragmentShader.glsl");
    
    const glowV =await getFileContents("./glowShader.glsl");

    const spikeV=await getFileContents("./spikeVertex.glsl");
    const spikeF=await getFileContents("./spikefrag.glsl");

   const geometry = new three.SphereGeometry(1, 128, 128);

    const material = new three.ShaderMaterial({
    uniforms: {
        baseColor: { value: new three.Color(0xff5555) },
        spikeHeight: { value: 0.3 },
        spikeFreq: { value: 10.0 } ,
        time: { value: 0.0 } 
    },
    vertexShader: spikeV,
    fragmentShader: spikeF,
    side: three.DoubleSide,
    transparent: true,
    depthWrite: false,
    additiveBlending: true,
    depthTest: true
});

    const spike = new three.Mesh(geometry, material);


    const sphereMat = new three.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    transparent: true,
    uniforms: {
        tex: { value: sunTexture }
    }
    });

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


    const sphereObj = new three.SphereGeometry(1,32, 32);
    function init() {
        
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 70, 1.0, 0.1, 100 );
        camera.position.z = 2;

        let mesh = new three.Mesh( sphereObj, sphereMat);
        let glowMesh= new three.Mesh(new three.SphereGeometry(1.2,32, 32), glowMat);
        glowMesh.scale.multiplyScalar(1.2);

        scene = new three.Scene();
        scene.add( mesh );
        scene.add(spike);
        mesh.add(glowMesh);
        // scene.add(sphere);

        renderer = new three.WebGLRenderer( { antialias: true,canvas:can }  );
        renderer.setAnimationLoop( Karlsanimate );
        controls = new OrbitControls( camera, renderer.domElement );
       
        controls.enableDamping = true;
        controls.minDistance = 1;
        controls.maxDistance = 10;
 
    }

    function Karlsanimate() {
        controls.update();
        renderer.render( scene, camera );
        material.uniforms.time.value += 0.01;
    }

    window.onload=init();
