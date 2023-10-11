// 方式 1: 导入整个 three.js核心库
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutlineOnlyPass } from './OutlineOnlyPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'


let scene = null
let renderer = null
let renderer_temp = null
let camera = null
// renderer.setSize(window.innerWidth, window.innerHeight);
let width = 1200.0
let height = 800.0
export function InitFrame() {
    renderer = new THREE.WebGLRenderer();
    renderer_temp = new THREE.WebGLRenderer();
    let canvas3D = document.getElementById('canvas-3d');

    renderer.setSize(width, height);
    renderer.colorSpace = THREE.SRGBColorSpace;
    renderer_temp.setSize(width, height);
    canvas3D.appendChild(renderer.domElement);


    let camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 3000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // 设置相机控件轨道控制器OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    orbitControls.addEventListener('change', function () {
        // renderer.render(scene, camera); //执行渲染操作
    });//监听鼠标、键盘事件


    scene = new THREE.Scene();
    //环境光:没有特定方向，整体改变场景的光照明暗
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    // scene.background = new THREE.Color(0xa0a0a0);


    // 平行光
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.castShadow = false;
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;
    // const d = 10;

    // light.shadow.camera.left = - d;
    // light.shadow.camera.right = d;
    // light.shadow.camera.top = d;
    // light.shadow.camera.bottom = - d;
    // light.shadow.camera.far = 200;
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    light.position.set(80, 100, 50);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
    // directionalLight.target = mesh;
    scene.add(light);

    // DirectionalLightHelper：可视化平行光
    const dirLightHelper = new THREE.DirectionalLightHelper(light, 5, 0xff0000);
    scene.add(dirLightHelper);

    //create a blue LineBasicMaterial
    // const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // const points = [];
    // points.push(new THREE.Vector3(- 10, 0, 0));
    // points.push(new THREE.Vector3(0, 10, 0));
    // points.push(new THREE.Vector3(10, 0, 0));
    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // const line = new THREE.Line(geometry, material);
    // scene.add(line);

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

    postprocessing()
    init()
    register()
    animation()

    let selectable_bone = []

    function init() {
        const loader = new GLTFLoader();

        loader.load('./src/assets/3d/tmall.gltf', function (gltf) {
            // 可视化骨骼
            const helper = new THREE.SkeletonHelper(gltf.scene);
            scene.add(helper);

            console.log('loader.load gltf');
            scene.add(gltf.scene);

            // 递归遍历所有模型节点批量修改材质
            gltf.scene.traverse(function (obj) {
                if (obj.isMesh) {//判断是否是网格模型
                    console.log('模型节点', obj);
                    console.log('模型节点名字', obj.name);
                    // 重新设置材质
                    const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 5 });
                    obj.material = phongMaterial

                    obj.receiveShadow = true;
                    obj.castShadow = true;
                    obj.frustumCulled = false; // 关闭遮挡剔除
                }
                // 如果子节点为骨骼
                if (obj.isBone) {
                    // boneNum += 1;
                    // if (child instanceof THREE.Bone) {
                    //     var bonename = child.name;
                    //     if (bonename == "hip") {
                    //         // 设置位移
                    //         child.position.set(0.0, 0.0, 0.0);
                    //         // 设置旋转
                    //         child.quaternion.set(0.0, 0.0, 0.0, 1.0);
                    //     }
                    // }
                    console.log('骨骼名称', obj.name);


                    // 添加球形 显示
                    const geometry = new THREE.SphereGeometry(0.04, 32, 32);
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
                    transformControls.addEventListener('change', () =>{
                        // selectable_bone.forEach((t)=>{
                        //     const worldPosition_ = new THREE.Vector3();
                        //     t.userData.transformControls.getWorldPosition(worldPosition_);
                        //     t.position.copy(worldPosition_);
                        // })
                    });
                    transformControls.visible = false;
                    transformControls.enabled = false;

                    scene.add(transformControls);
                    mesh.userData.transformControls = transformControls;

                    selectable_bone.push(mesh)

                    scene.add(mesh)
                }

            })
            addSelectedObject(gltf.scene)
        }, undefined, function (error) {

            console.error(error);

        });

    }

    function postprocessing() {
        // postprocessing

        composer = new EffectComposer(renderer, renderTarget);

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        outlinePass = new OutlineOnlyPass(new THREE.Vector2(width, height), scene, camera);
        console.log(outlinePass, composer);
        outlinePass.usePatternTexture = true;
        composer.addPass(outlinePass);

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('./src/assets/3d/tri_pattern.jpg', function (texture) {
            outlinePass.patternTexture = texture;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        });

        // const outputPass = new OutputPass();
        const outputPass = new OutputPass();
        composer.addPass(outputPass);

        // let effectFXAA = new ShaderPass(FXAAShader);
        // effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        // composer.addPass(effectFXAA);

        composer.addPass(new ShaderPass(GammaCorrectionShader)); // 修复gamma显示


        renderer.domElement.style.touchAction = 'none';
        renderer.domElement.addEventListener('pointermove', onPointerMove);

        function onPointerMove(event) {

            if (event.isPrimary === false) return;
            //屏幕坐标px、py转WebGL标准设备坐标x、y
            //width、height表示canvas画布宽高度
            mouse.x = (event.offsetX / width) * 2 - 1;
            mouse.y = -(event.offsetY / height) * 2 + 1;
            checkIntersection();

        }



        function checkIntersection() {

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(scene, true);

            if (intersects.length > 0) {
                // const selectedObject = intersects[0].object;
                // console.log('checkIntersection', selectedObject);
                // addSelectedObject(selectedObject);
                // outlinePass.selectedObjects = selectedObjects;

            } else {

                // outlinePass.selectedObjects = [];

            }

        }
    }

    function addSelectedObject(object) {

        selectedObjects = [];
        selectedObjects.push(object);
        outlinePass.selectedObjects = selectedObjects;
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
            selectable_bone.forEach((t)=>{
                t.userData.transformControls.visible = false;
                t.userData.transformControls.enabled = false;
                t.material.color.set(0x8888ff);
            })
            if(currentSelected == null) return
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

        
        renderer.setRenderTarget(null); // change back to the canvas
        renderer.render(scene, camera);
        
        // orbitControls.update();
        composer.renderToScreen = false
        composer.render();

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
    for(let i = 0, j = height - 1; i < j; ++i, --j) {
  
      // 交换两行的数据
      for(let k = 0; k < 4 * width; ++k) {
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
