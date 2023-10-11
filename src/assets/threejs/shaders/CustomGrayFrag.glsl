

// pass in our custom uniforms
uniform float rPower;
uniform float gPower;
uniform float bPower;

// pass in the image/texture well be modifying
uniform sampler2D tDiffuse;

// used to determine the correct texel were working on
varying vec2 vUv;

// executed, in parallel, for each pixel
void main() {

    // get the pixel from the texture were working with (called a texel)
    vec4 texel = texture2D(tDiffuse, vUv);

    // calculate the new color
    float gray = texel.r * rPower + texel.g * gPower + texel.b * bPower;

    // return this new color
    gl_FragColor = vec4(vec3(gray), texel.w);

}