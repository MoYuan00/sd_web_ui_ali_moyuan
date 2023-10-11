// 方式 1: 导入整个 three.js核心库
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlineMaterial } from './OutlineMaterial.js';
import { CustomCandyMaterial } from './CustomCandyMaterial.js';
import { CopyShader } from 'three/addons/shaders/CopyShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'


let scene = null
let renderer = null
let renderer_temp = null
let camera = null
// renderer.setSize(window.innerWidth, window.innerHeight);
let width = 700.0
let height = 400.0

let bone_poistion_record = []

export function InitFrame() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer_temp = new THREE.WebGLRenderer();
    let canvas3D = document.getElementById('canvas-3d');

    renderer.setSize(width, height);
    renderer.colorSpace = THREE.SRGBColorSpace;
    renderer_temp.setSize(width, height);
    canvas3D.appendChild(renderer.domElement);


    let camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 3000);
    camera.position.set(0, 1, 4);
    // camera.lookAt(0, 1111, 0);

    // 设置相机控件轨道控制器OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    // // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    // orbitControls.addEventListener('change', function () {
    //     // renderer.render(scene, camera); //执行渲染操作
    // });//监听鼠标、键盘事件
    orbitControls.target.set(0, 1, 0);//控制焦点
    orbitControls.update();  // 需要刷新才会生效

    scene = new THREE.Scene();
    //环境光:没有特定方向，整体改变场景的光照明暗
    // const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    // scene.add(ambient);
    // scene.background = new THREE.Color(0x00000000);
    renderer.setClearColor(0xEEEEEE, 0.0); // 设置背景透明
    renderer.setClearAlpha(0.0);

    // 平行光
    // const light = new THREE.DirectionalLight(0xffffff, 3);
    // light.castShadow = false;

    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    // light.position.set(80, 100, 50);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
    // directionalLight.target = mesh;
    // scene.add(light);

    // DirectionalLightHelper：可视化平行光
    // const dirLightHelper = new THREE.DirectionalLightHelper(light, 5, 0xff0000);
    // scene.add(dirLightHelper);

    // 添加坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper)

    // var
    var mouse = new THREE.Vector2()
    const raycaster = new THREE.Raycaster();
    let selectedObjects = [];
    let composer = null;
    let outlinePass = null;
    const renderTarget = new THREE.WebGLRenderTarget(width, height);

    let selectable_bone = []

    init()
    addProcesser()
    register()
    animation()


    function init() {
        const loader = new GLTFLoader();

        loader.load('./src/assets/3d/tmall.gltf', function (gltf) {
            // 可视化骨骼
            const helper = new THREE.SkeletonHelper(gltf.scene);
            scene.add(helper);
            // scene.add(gltf.scene);

            // 递归遍历所有模型节点批量修改材质
            gltf.scene.traverse(function (obj) {
                if (obj.isMesh) {//判断是否是网格模型
                    console.log('模型节点名字', obj.name);
                    // 重新设置材质
                    // const phongMaterial = new THREE.MeshLambertMaterial();
                    const phongMaterial = OutlineMaterial.clone();
                    // if(obj.name == '眼珠' || obj.name == '眼珠1'
                    // || obj.name == '现在的头_2') {
                    //     phongMaterial.uniforms.color.value = new THREE.Color(0.2, 0.2, 0.2);
                    // }
                    // if(obj.name == '身体') {
                    //     phongMaterial.uniforms.color.value = new THREE.Color(1, 0.3, 0.3);
                    // }
                    obj.material = phongMaterial;


                }
                // 如果子节点为骨骼
                if (obj.isBone) {
                    console.log('骨骼名称', obj.name);


                    // 添加球形 显示
                    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
                    const material = new THREE.MeshLambertMaterial({
                        color: 0x8888ff,
                        depthTest: false,
                    });
                    let mesh = new THREE.Mesh(geometry);
                    mesh.material = material;
                    mesh.userData.selectable = true
                    mesh.userData.bind_bone_name = obj.name
                    mesh.renderOrder = 191199;
                    const worldPosition = new THREE.Vector3();
                    // 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
                    obj.getWorldPosition(worldPosition);
                    mesh.position.copy(worldPosition);


                    let transformControls = new TransformControls(camera, renderer.domElement);
                    console.log(transformControls);
                    transformControls.size = 0.75;
                    // transformControls.showX = true;
                    transformControls.space = 'world';
                    transformControls.attach(obj);
                    transformControls.addEventListener('mouseDown', () => orbitControls.enabled = false);
                    transformControls.addEventListener('mouseUp', () => orbitControls.enabled = true);
                    transformControls.setMode('rotate')
                    transformControls.visible = false;
                    transformControls.enabled = false;

                    scene.add(transformControls);
                    mesh.userData.transformControls = transformControls;
                    mesh.userData.bone = obj;

                    selectable_bone.push(mesh)
                    bone_poistion_record.push({ name: obj.name, position: obj.position.clone(), rotation: obj.rotation.clone() })

                    scene.add(mesh)
                }

            })
            scene.add(gltf.scene)
        }, undefined, function (error) {
            console.error(error);
        });

    }



    function bindBoneSphere() {

        selectable_bone.forEach((obj) => {
            const worldPosition = new THREE.Vector3();
            obj.userData.bone.getWorldPosition(worldPosition);
            obj.position.copy(worldPosition);
        })
    }


    function addProcesser() {
        const renderPass = new RenderPass(scene, camera)
        const effectCopy = new ShaderPass(CopyShader)
        effectCopy.renderToScreen = true

        const effectCustomGrayScale = new ShaderPass(CustomCandyMaterial)
        composer = new EffectComposer(renderer, renderTarget)
        composer.addPass(renderPass)
        composer.addPass(effectCustomGrayScale)
        composer.addPass(effectCopy)
    }

    let currentSelected = null
    let lasttSelected = null
    function register() {

        var mouse_3d_point = new THREE.Vector3()
        var raycaster = new THREE.Raycaster()

        renderer.domElement.addEventListener('mousedown', () => {

            mouse.x = (event.offsetX / width) * 2 - 1;
            mouse.y = -(event.offsetY / height) * 2 + 1;

            // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
            raycaster.setFromCamera(mouse, camera);

            // 获取raycaster直线和所有模型相交的数组集合
            var intersects = raycaster.intersectObjects(scene.children);

            // 将所有的相交的模型的颜色设置为红色
            for (var i = 0; i < intersects.length; i++) {

                if (intersects[i].object.userData.selectable) {
                    orbitControls.enabled = false;
                    lasttSelected = currentSelected;
                    currentSelected = intersects[i].object;



                    mouse_3d_point = intersects[i].point;
                    let bind_bone = scene.getObjectByName(currentSelected.userData.bind_bone_name)


                    break;
                }
            }


        })


        renderer.domElement.addEventListener('click', () => {
            selectable_bone.forEach((t) => {
                t.userData.transformControls.visible = false;
                t.userData.transformControls.enabled = false;
                t.material.color.set(0x8888ff);
            })
            if (currentSelected == null) return
            currentSelected.userData.transformControls.visible = true;
            currentSelected.userData.transformControls.enabled = true;
            currentSelected.material.color.set(0xff0000);
        })
        renderer.domElement.addEventListener('mouseup', () => {

            orbitControls.enabled = true;
        })
    }
    // 获取鼠标点击点的场景坐标
    // 解决坐标偏移问题核心代码
    function getMousePosition(clientX, clientY) {

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            return intersects[0].point;
        }

        return null;
    }
    function animation() {
        requestAnimationFrame(animation);

        bindBoneSphere()

        renderer.setRenderTarget(null); // change back to the canvas
        renderer.render(scene, camera);

        renderer.setRenderTarget(renderTarget); // change back to the canvas
        renderer.render(scene, camera);
        orbitControls.update();

        if (composer) {
            composer.renderToScreen = false
            // composer.setRenderTarget(renderTarget)
            composer.render()
        }


        showRenderTarget()
    }

    function showRenderTarget() {
        let containEL = document.getElementById('show-result-3d');
        containEL.width = width;
        containEL.height = height;
        let ctx = containEL.getContext("2d");
        let imgdata = renderTargetToImg(width, height, renderTarget);

        ctx.putImageData(imgdata, 0, 0);
    }
}


function flipY(buffer, width, height) {
    // 每一轮循环 第i行和第j行交换
    for (let i = 0, j = height - 1; i < j; ++i, --j) {

        // 交换两行的数据
        for (let k = 0; k < 4 * width; ++k) {
            const t = buffer[i * width * 4 + k]
            buffer[i * width * 4 + k] = buffer[j * width * 4 + k]
            buffer[j * width * 4 + k] = t
        }
    }
}

function renderTargetToImg(width, height, renderTarget) {
    const buffer = new Uint8Array(width * height * 4);

    renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer); // 读取像素到 buffer

    flipY(buffer, width, height)
    const clamped = new Uint8ClampedArray(buffer.buffer);
    return new ImageData(clamped, width, height, { colorSpace: 'srgb' }); // 创建可供 canvas 使用的图像数据类型
}


export function restoreBonePosition() {
    bone_poistion_record.forEach((t) => {
        let obj = scene.getObjectByName(t.name)
        obj.position.copy(t.position)
        obj.rotation.copy(t.rotation)
    })
}