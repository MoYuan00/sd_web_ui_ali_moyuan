

// pass in our custom uniforms
uniform float rPower;
uniform float gPower;
uniform float bPower;

// pass in the image/texture well be modifying
uniform sampler2D tDiffuse;

// used to determine the correct texel were working on
varying vec2 vUv;
//计算灰度值
float luminance(vec4 color)
{
    return 0.2125 * color.r + 0.7154 * color.g + 0.0721 * color.b;
}

void VES_Get_Box9_UV(vec2 uv, vec2 unit, out vec2 boxuv[9]) {
    vec2 BOX_9[9];
    BOX_9[0] = vec2(-1.0, -1.0);
    BOX_9[1] = vec2(0.0, -1.0);
    BOX_9[2] = vec2(1.0, -1.0);

    BOX_9[3] = vec2(-1.0, 0.0);
    BOX_9[4] = vec2(0.0, 0.0);
    BOX_9[5] = vec2(1.0, 0.0);
    BOX_9[6] = vec2(-1.0, 1.0);
    BOX_9[7] = vec2(0.0, 1.0);
    BOX_9[8] = vec2(1.0, 1.0);

    for(int it = 0; it < 9; it++) {
        boxuv[it] = uv + BOX_9[it] * unit.xy;
    }
}
//Sobel效果主体
float VES_Sobel(vec2 boxuv[9]) {
	//两个算子
    highp int VES_SOBEL_Gx[9];
    VES_SOBEL_Gx[0] = -1;
    VES_SOBEL_Gx[1] = -2;
    VES_SOBEL_Gx[2] = -1;
    VES_SOBEL_Gx[3] = 0;
    VES_SOBEL_Gx[4] = 0;
    VES_SOBEL_Gx[5] = 0;
    VES_SOBEL_Gx[6] = 1;
    VES_SOBEL_Gx[7] = 2;
    VES_SOBEL_Gx[8] = 1;

    highp int VES_SOBEL_Gy[9];
    VES_SOBEL_Gy[0] = -1;
    VES_SOBEL_Gy[1] = 0;
    VES_SOBEL_Gy[2] = 1;
    VES_SOBEL_Gy[3] = -2;
    VES_SOBEL_Gy[4] = 0;
    VES_SOBEL_Gy[5] = 2;
    VES_SOBEL_Gy[6] = -1;
    VES_SOBEL_Gy[7] = 0;
    VES_SOBEL_Gy[8] = 1;

    float texColor;
    float eX = 0.0;
    float eY = 0.0;
    //采样求梯度值
    for(int n = 0; n < 9; n++) {
    	// 这里是针对亮度值进行采样
        texColor = luminance(texture2D(tDiffuse, boxuv[n]));
        eX += texColor * float(VES_SOBEL_Gx[n]);
        eY += texColor * float(VES_SOBEL_Gy[n]);
    }
    float result = clamp( 1.0 - float(abs(eX) + abs(eY)), 0.0, 1.0);

    // 进行 锐化
    if(result < 0.5) {
        result = 0.0;
    } else {
        result = 1.0;
    }
    return result;
}

uniform vec2 texSize; // 像素大小 - 传入


// executed, in parallel, for each pixel
void main() {
    vec2 invSize = 1.0 / texSize;
    vec2 uvBox9[9];
    VES_Get_Box9_UV(vUv, invSize, uvBox9);

    float result = VES_Sobel(uvBox9);


    // get the pixel from the texture were working with (called a texel)
    vec4 texel = texture2D(tDiffuse, vUv);

    // calculate the new color
    float gray = texel.r * rPower + texel.g * gPower + texel.b * bPower;

    // return this new color
    // gl_FragColor = vec4(vec3(gray), texel.w);
    gl_FragColor = vec4(vec3(result), texel.w);

}