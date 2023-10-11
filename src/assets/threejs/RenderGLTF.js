// 方式 1: 导入整个 three.js核心库
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let scene = null
let renderer = null
let camera = null
// renderer.setSize(window.innerWidth, window.innerHeight);

export function InitFrame() {
    renderer = new THREE.WebGLRenderer();
    let canvas3D = document.getElementById('canvas-3d');
    renderer.setSize(1200, 800);
    canvas3D.appendChild(renderer.domElement);
    let width = renderer.domElement.width
    let height = renderer.domElement.height


    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
        renderer.render(scene, camera); //执行渲染操作
    });//监听鼠标、键盘事件


    scene = new THREE.Scene();
    //环境光:没有特定方向，整体改变场景的光照明暗
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    scene.background = new THREE.Color(0xa0a0a0);


    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    directionalLight.position.set(80, 100, 50);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
    // directionalLight.target = mesh;
    scene.add(directionalLight);

    // DirectionalLightHelper：可视化平行光
    const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
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
                const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 5 } );
                obj.material = phongMaterial
                
                obj.receiveShadow = true;
                obj.castShadow = true;
            }
        });

        gltf.scene.traverse(function (obj) {
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
                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshLambertMaterial({
                    color: 0x8888ff,
                    depthTest: false,
                });
                let mesh = new THREE.Mesh(geometry);
                mesh.material = material;
                mesh.userData.selectable = true
                mesh.userData.bind_bone_name = obj.name
                // mesh.renderOrder = 191199;
                const worldPosition = new THREE.Vector3();
                // 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
                obj.getWorldPosition(worldPosition);
                mesh.position.copy(worldPosition);
                scene.add(mesh)

            }

        })


        renderer.render(scene, camera);
        animation()

    }, undefined, function (error) {

        console.error(error);

    });
    let count = 1
    function animation() {
        renderer.render(scene, camera);
        requestAnimationFrame(animation);
        let left_bone = scene.getObjectByName('关节_1_3');
        // left_bone.position.x -= 1;

        count++;
    }

    let currentSelected = null

    function register() {
        var mouse = new THREE.Vector2()
        var mouse_3d_point = new THREE.Vector3()
        var raycaster = new THREE.Raycaster()

        renderer.domElement.addEventListener('mousedown', () => {
            const px = event.offsetX;
            const py = event.offsetY;
            //屏幕坐标px、py转WebGL标准设备坐标x、y
            //width、height表示canvas画布宽高度
            const x = (px / width) * 2 - 1;
            const y = -(py / height) * 2 + 1;
            mouse.x = x;
            mouse.y = y;

            // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
            raycaster.setFromCamera(mouse, camera);

            // 获取raycaster直线和所有模型相交的数组集合
            var intersects = raycaster.intersectObjects(scene.children);

            // 将所有的相交的模型的颜色设置为红色
            for (var i = 0; i < intersects.length; i++) {

                if (intersects[i].object.userData.selectable) {
                    currentSelected = intersects[i].object;
                    console.log(currentSelected);
                    mouse_3d_point = intersects[i].point;
                    let bind_bone = scene.getObjectByName(currentSelected.userData.bind_bone_name)
                    console.log(bind_bone);

                    intersects[i].object.material.color.set(0xff0000);
                    break;
                }
            }

        })

        renderer.domElement.addEventListener('mousemove', () => {

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
    register()
}


function renderTargetToImg(width, height, renderTarget) {
    const buffer = new Uint8Array(width * height * 4);
    const clamped = new Uint8ClampedArray(buffer.buffer);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer); // 读取像素到 buffer
    return new ImageData(clamped, width, height); // 创建可供 canvas 使用的图像数据类型
}
