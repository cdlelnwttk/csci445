
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';

    let camera, scene, renderer,controls;
    const textureLoader=new three.TextureLoader();


    const sun = textureLoader.load('./sun.jpg');
    const sunMat = new three.MeshBasicMaterial({ map: sun});
    const sunObj = new three.SphereGeometry( 1.5, 32, 16 ); 
    
    const mercury = textureLoader.load('./mercury.jpg');
    const mercuryMat = new three.MeshBasicMaterial({ map: mercury});
    const mercuryObj = new three.SphereGeometry( 0.25, 32, 16 ); 


    const venus = textureLoader.load('./venus.jpg');
    const venusMat = new three.MeshBasicMaterial({ map: venus});
    const venusObj = new three.SphereGeometry( 0.5, 32, 16 ); 

    
    const earth = textureLoader.load('./earth.jpg');
    const earthMat = new three.MeshBasicMaterial({ map: earth});
    const earthObj = new three.SphereGeometry( 0.5, 32, 16 ); 


 
    const accelerations=[];
    const velocities=[];
    var positions=[];
 
    let time=0.0;

    function init() {
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 100, 1.0, 0.1, 1000);
        camera.position.z = 100;

        scene = new three.Scene();
        let sunMesh = new three.Mesh( sunObj, sunMat );
        scene.add(sunMesh);

        let mercuryMesh = new three.Mesh(mercuryObj, mercuryMat );
        mercuryMesh.position.set(-3, 0, 0);
        scene.add(mercuryMesh);

        let venusMesh = new three.Mesh(venusObj, venusMat );
        venusMesh.position.set(-4, 0, 0);
        scene.add(venusMesh);

        let earthMesh = new three.Mesh(earthObj, earthMat );
        earthMesh.position.set(-5.75, 0, 0);
        scene.add(earthMesh);

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
        for (let i=0;i<positions.length;i++){
            let total=new three.Vector3();
            for (let j=0;j<positions.length;j++){
              if (i!=j) {
                 let v=new three.Vector3();
                 v.subVectors(positions[j],positions[i]);
                 let pull=v.lengthSq();
                 if (pull>=1) {
                    v.divideScalar(pull);
                    total.addVectors(total,v); // total=total+v;
                 }
              }
            }
            accelerations[i]=total;
        }
        for (let i=0;i<positions.length;i++){
            let a=accelerations[i].clone();
            a.multiplyScalar(dt);
            let v=velocities[i].clone();
            v.multiplyScalar(dt);
            velocities[i].addVectors(velocities[i],a);
            positions[i].addVectors(positions[i],v);
        }
        time+=dt;
    }

    window.onload=init();
