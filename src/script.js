import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { color, mix } from 'three/tsl'


const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader();
const starText = textureLoader.load("/textures/circle_05.png")
const bigStarText = textureLoader.load("/textures/star_01.png")
const centerLineText = textureLoader.load("/textures/flare_01.png")
const centerPointText = textureLoader.load("/textures/flame_04.png")


let galaxyMaterial ;
let galaxyGeometry ;
let points = null ;

let starMaterial ;
let starGeometry ;
let star = null ;

let centerMaterial ;
let centerGeometry ;
let center = null ;

let centerPointMaterial ;
let centerPointGeometry ;
let centerPoint = null ;

const parameters = {};
parameters.counts = 100000;
parameters.size = 0.06;
parameters.radius = 17;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 2.5;
parameters.randomnessPower = 2.5;
parameters.color1 = "#ff5588";
parameters.color2 = "#1b3984";
parameters.bigStar = 48
parameters.starRadius = 0.4 ;
parameters.cloudSize = 5 ;

const galaxyGenerator = ()=>{

    if( points !== null ){
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        scene.remove(points)
    }
    if( star !== null ){
        starGeometry.dispose();
        starMaterial.dispose();
        scene.remove(star)
    }
    if( center !== null ){
        centerGeometry.dispose();
        centerMaterial.dispose();
        scene.remove(center)
    }
    if( centerPoint !== null ){
        centerPointGeometry.dispose();
        centerPointMaterial.dispose();
        scene.remove(centerPoint)
    }

    galaxyGeometry = new THREE.BufferGeometry()
    const position = new Float32Array(parameters.counts * 3);
    const colors = new Float32Array(parameters.counts * 3);

    starGeometry = new THREE.BufferGeometry()
    const starPosition = new Float32Array(parameters.bigStar * 3);
    // const starColors = new Float32Array(10 * 3);

    centerGeometry = new THREE.BufferGeometry()
    const centerPosition = new Float32Array((parameters.counts/18) * 3);

    centerPointGeometry = new THREE.BufferGeometry()
    const centerPointPosition = new Float32Array(1 * 3);

    for(let l = 0 ; l< 1 ;l++){
        const l3 = l * 3

        centerPointPosition[l3 + 0] = 0 ;
        centerPointPosition[l3 + 1] = 0
        centerPointPosition[l3 + 2] = 0;
    }

    for(let k = 0; k < parameters.counts / 40; k++){
    const k3 = k * 3;

    const y = (Math.random() - 0.5) * 35;

    const radius = Math.pow(Math.random(), parameters.randomnessPower) * 0.3;

    const angle = Math.random() * Math.PI * 2;

    centerPosition[k3 + 0] = Math.cos(angle) * radius;
    centerPosition[k3 + 1] = y;
    centerPosition[k3 + 2] = Math.sin(angle) * radius;
}

    for(let j = 0 ; j< parameters.bigStar ;j++){
        const j3 = j * 3

        
        starPosition[j3 + 0] = (Math.random() - 0.5 )* 20;
        starPosition[j3 + 1] = 0
        starPosition[j3 + 2] = (Math.random() - 0.5 )* 20;
    }

    for(let i = 0 ; i < parameters.counts ; i++){
        
        const i3 = i * 3

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches)/parameters.branches * Math.PI * 2 ;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1:-1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1:-1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1:-1)

        const colorInside = new THREE.Color(parameters.color1);
        const colorOutside = new THREE.Color(parameters.color2);

        position[i3 + 0] = Math.sin(branchAngle + spinAngle) * radius + randomX ;
        position[i3 + 1] = randomY
        position[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

        const mixColor = colorInside.clone();
        mixColor.lerp(colorOutside,radius/parameters.radius)

        colors[i3 + 0] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;

    }

    galaxyGeometry.setAttribute("position", new THREE.BufferAttribute( position , 3 ) );
    starGeometry.setAttribute("position", new THREE.BufferAttribute( starPosition , 3 ) );
    centerGeometry.setAttribute("position", new THREE.BufferAttribute( centerPosition , 3 ) );
    centerPointGeometry.setAttribute("position", new THREE.BufferAttribute( centerPointPosition , 3 ) );

    galaxyGeometry.setAttribute("color", new THREE.BufferAttribute( colors , 3 ) );

    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation : true,
        depthWrite : false,
        blending : THREE.AdditiveBlending,
        alphaMap : starText,
        transparent : true,
        vertexColors : true
    })

    centerMaterial = new THREE.PointsMaterial({
        size: parameters.size * 2 ,
        sizeAttenuation : true,
        depthWrite : false,
        blending : THREE.AdditiveBlending,
        alphaMap : centerLineText,
        transparent : true,
    })

    starMaterial = new THREE.PointsMaterial({
        size: parameters.starRadius,
        sizeAttenuation : true,
        depthWrite : false,
        blending : THREE.AdditiveBlending,
        alphaMap : bigStarText,
        transparent : true,
        
    })

    centerPointMaterial = new THREE.PointsMaterial({
        size: parameters.cloudSize  ,
        sizeAttenuation : true,
        depthWrite : false,
        blending : THREE.AdditiveBlending,
        alphaMap : centerPointText,
        transparent : true,
    })

    points = new THREE.Points( galaxyGeometry , galaxyMaterial );
    star = new THREE.Points( starGeometry , starMaterial );
    center = new THREE.Points( centerGeometry , centerMaterial );
    centerPoint = new THREE.Points( centerPointGeometry , centerPointMaterial );

    scene.add(points);
    scene.add(star);
    scene.add(center);
    scene.add(centerPoint);

}
galaxyGenerator()

gui.add(parameters,"counts",100,100000).onFinishChange(galaxyGenerator);
gui.add(parameters,"size",0.01,0.1).onFinishChange(galaxyGenerator);
gui.add(parameters,"radius",3,20).onFinishChange(galaxyGenerator);
gui.add(parameters,"branches",3,20).step(1).onFinishChange(galaxyGenerator);
gui.add(parameters,"spin",-5,5).step(1).onFinishChange(galaxyGenerator);
gui.add(parameters,"randomness",0,3).step(0.2).onFinishChange(galaxyGenerator);
gui.add(parameters,"randomnessPower",0,10).step(0.5).onFinishChange(galaxyGenerator);
gui.addColor(parameters,"color1").onFinishChange(galaxyGenerator);
gui.addColor(parameters,"color2").onFinishChange(galaxyGenerator);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 6
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()
    if (points) {
        points.rotation.y -= 0.001; 
    }
    if (star) {
        star.rotation.y -= 0.001; 
    }
    if (center) {
        center.rotation.y += 0.1; 
    }
    center.scale.setScalar(1 + Math.sin(elapsedTime) * 0.2);
    // centerPoint.position.y = 2;
    // centerPoint.position.x = 0.12
    star.rotation.x = -10
    points.rotation.x = -10
    center.rotation.x = -10
    centerPoint.rotation.x = -10

    renderer.render(scene, camera)
    
    window.requestAnimationFrame(tick)
}

tick()