import testVertexShader from './shaders/CustomGrayVert.glsl?raw'
import testFragmentShader from './shaders/CustomGrayFrag.glsl?raw'
// 自定义灰度着色器
export const CustomGrayMaterial = {
  'uniforms': {

    'tDiffuse': { 'type': 't', 'value': null },
    'rPower': { 'type': 'f', 'value': 0.2126 },
    'gPower': { 'type': 'f', 'value': 0.7152 },
    'bPower': { 'type': 'f', 'value': 0.0722 }

  },

  // 0.2126 R + 0.7152 G + 0.0722 B
  // vertexshader is always the same for postprocessing steps
  'vertexShader': testVertexShader,
  'fragmentShader': testFragmentShader
}