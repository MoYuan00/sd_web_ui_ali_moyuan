// 方式 1: 导入整个 three.js核心库
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer();
let scene = null
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

export function InitFrame() {
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    let canvas3D = document.getElementById('canvas-3d');
    canvas3D.appendChild(renderer.domElement);

    
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });


    const points = [];
    points.push(new THREE.Vector3(- 10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);
}


export function LoadModel() {
    const loader = new GLTFLoader();

    loader.load('./src/assets/3d/tmall.gltf', function (gltf) {

        scene.add(gltf.scene);
        renderer.render(scene, camera);
        console.log('loader.load gltf');

    }, undefined, function (error) {

        console.error(error);

    });
}

