
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';

    let camera, scene, renderer,controls;
    const textureLoader=new three.TextureLoader();


    const sun = textureLoader.load('./sun.jpg');
    const sunMat = new three.MeshBasicMaterial({ map: sun});
    const sunObj = new three.SphereGeometry( 2, 32, 16 ); 
    
    const mercury = textureLoader.load('./mercury.jpg');
    const mercuryMat = new three.MeshStandardMaterial({ map: mercury});
    const mercuryObj = new three.SphereGeometry( 0.1, 32, 16 ); 


    const venus = textureLoader.load('./venus.jpg');
    const venusMat = new three.MeshStandardMaterial({ map: venus});
    const venusObj = new three.SphereGeometry( 0.2, 32, 16 ); 

    
    const earth = textureLoader.load('./earth.jpg');
    const earthMat = new three.MeshStandardMaterial({ map: earth});
    const earthObj = new three.SphereGeometry( 0.2, 32, 16 ); 

    const mars = textureLoader.load('./mars.jpg');
    const marsMat = new three.MeshStandardMaterial({ map: mars});
    const marsObj = new three.SphereGeometry( 0.15, 32, 16 ); 

    const jupiter = textureLoader.load('./jupiter.jpg');
    const jupiterMat = new three.MeshStandardMaterial({ map: jupiter});
    const jupiterObj = new three.SphereGeometry( 0.5, 32, 16 ); 

    const saturn = textureLoader.load('./saturn.jpg');
    const saturnMat = new three.MeshStandardMaterial({ map: saturn});
    const saturnObj = new three.SphereGeometry( 0.4, 32, 16 ); 

    const geometry = new three.TorusGeometry(2, 0.025, 10,30);
    const material = new three.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new three.Mesh(geometry, material);


    const accelerations=[];
    const velocities=[];
    var positions=[];
 
    let time=0.0;

    function addplanet(object, material, position) {
        let planetMesh = new three.Mesh(object, material);
        planetMesh.position.set(position, 0, 0);
        scene.add(planetMesh);
    }
    
    function set_position(earth_distance) {

    }
    function init() {
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 120, 1.0, 1, 100000);
        camera.position.z = 50

        scene = new three.Scene();
        let sunMesh = new three.Mesh( sunObj, sunMat );
        scene.add(sunMesh);

        addplanet(mercuryObj, mercuryMat, -2.5);
        addplanet(venusObj, venusMat, -3);
        addplanet(earthObj, earthMat, -3.5);
        addplanet(marsObj, marsMat, -4.2);
        addplanet(jupiterObj, jupiterMat, -7);
        addplanet(saturnObj, saturnMat, -9);

        renderer = new three.WebGLRenderer( { antialias: true,canvas:can }  );
        renderer.setAnimationLoop( animate );
        controls = new OrbitControls( camera, renderer.domElement );
       
        controls.enableDamping = true;
        controls.minDistance = 1;
        controls.maxDistance = 10;
        // const light = new THREE.PointLight( 0xff0000, 1, 100 );
        // light.position.set( 0, 0, 0 );
        // scene.add( light );
        const sunLight = new three.PointLight(0xffffff, 100, 500);
        sunLight.position.set(0, 0, 0); // place at Sun
        scene.add(sunLight);
        //mesh.position.set(-.5, 0, 0);
        //scene.add(mesh);

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
        sunObj.rotateY(0.01);
    }

    window.onload=init();
