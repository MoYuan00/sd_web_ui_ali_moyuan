import testVertexShader from './shaders/OutlineVert.glsl?raw'
import testFragmentShader from './shaders/OutlineFrag.glsl?raw'

// f : float
// v2 : vec2
import * as THREE from 'three';

const uniforms = {
    // time: { type: "f", value: 1.0 },
    color: { type: "v3", value: new THREE.Color(1, 1, 1) }
    // resolution: { type: "v2", value: new THREE.Vector2() }
}

const vert = testVertexShader
const frag = testFragmentShader

export let OutlineMaterial = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: false,
    blending: THREE.NormalBlending,
    uniforms: uniforms
})


// export let OutlineMaterial  = new THREE.RawShaderMaterial({
//     uniforms: {},
//     vertexShader: `
//         uniform mat4 projectionMatrix;
//         uniform mat4 viewMatrix;
//         uniform mat4 modelMatrix;

//         attribute vec3 position;
//         varying float x;
//         void main()
//         {
//             gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
//             vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//             x = worldPosition.x;
//         }
//     `,
//     fragmentShader: `
//         precision mediump float; // 这条指令可以让我们决定浮点数的精度

//         varying float x;

//         void main()
//         {
//             gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
//         }
//     `,
//     wireframe: true,
    
// })

