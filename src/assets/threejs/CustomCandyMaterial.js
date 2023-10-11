import testVertexShader from './shaders/CustomCandyVert.glsl?raw'
import testFragmentShader from './shaders/CustomCandyFrag.glsl?raw'

import * as THREE from 'three';

// 自定义灰度着色器
export const CustomCandyMaterial = {
  'uniforms': {

    'tDiffuse': { 'type': 't', 'value': null },
    'rPower': { 'type': 'f', 'value': 0.2126 },
    'gPower': { 'type': 'f', 'value': 0.7152 },
    'bPower': { 'type': 'f', 'value': 0.0722 },
    'texSize': {'type': 'v2', value: new THREE.Vector2(1200.0, 800.0)}
  },

  // 0.2126 R + 0.7152 G + 0.0722 B
  // vertexshader is always the same for postprocessing steps
  'vertexShader': testVertexShader,
  'fragmentShader': testFragmentShader
}