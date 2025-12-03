
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';

        async function getFileContents(filename){
      return fetch(filename)
        .then((response)=>response.text())
        .then((text)=>{return text});
    }

    let camera, scene, renderer,controls;
    const textureLoader=new three.TextureLoader();
    const vertexShaderCode=await getFileContents("./vertexLightShader.glsl");
    const fragmentShaderCode=await getFileContents("./fragmentLightShader.glsl");

    const sun_image = textureLoader.load('./sun.jpg');
    // const sunMat = new three.MeshBasicMaterial({ map: sun_image });
    const sunObj= new three.SphereGeometry( 2, 32, 16 ); 
    
    const sphereMat = new three.ShaderMaterial({
    uniforms: {
        color: { value: new three.Color(0xff0000) }
    },
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode
});



    // const glowMat = new three.ShaderMaterial({
    //     uniforms: {
    //         glowColor: { value: new three.Color(0xFFFF00) },
    //         intensity: { value: 1.5 },
    //         time: { value: 0.0 },
    //     },
    //     vertexShader: vertexShaderCode,
    //     fragmentShader: fragmentShaderCode,
    //     transparent: true,
    //     blending: three.AdditiveBlending,
    //     depthWrite: false,
    //     side: three.BackSide
    // });

    // const sunGlow = new three.Mesh(new three.SphereGeometry(3,32,16), glowMat);

    let time=0.0;

    function init() {
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 100, 1.0, 0.1, 100 );
        camera.position.z = 10;

        scene = new three.Scene(); 
        scene.add( new three.Mesh( sunObj, sphereMat));
        scene.add(sunGlow);
        renderer = new three.WebGLRenderer( { antialias: true,canvas:can }  );
        renderer.setAnimationLoop( animate );
        controls = new OrbitControls( camera, renderer.domElement );
       
        controls.enableDamping = true;
        controls.minDistance = 1;
        controls.maxDistance = 10;
    }

    var dt=0.01;
    function animate() {
        controls.update();
        renderer.render( scene, camera );
        time+=dt;
    }

    window.onload=init();
