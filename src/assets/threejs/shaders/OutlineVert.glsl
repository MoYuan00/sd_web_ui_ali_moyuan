#define PHONG

// 传输变量
varying vec3 vViewPosition;
varying highp vec3 vNormalOS;
varying highp vec3 vNormalWS;
varying highp vec3 vPositionOS;
varying highp vec3 vPositionWS;

// #include <skinning_pars_vertex>
uniform highp sampler2D boneTexture;
uniform int boneTextureSize;
uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;

uniform vec3 color;

mat4 getBoneMatrix1(const in float i) {

    float j = i * 4.0;
    float x = mod(j, float(boneTextureSize));
    float y = floor(j / float(boneTextureSize));

    float dx = 1.0 / float(boneTextureSize);
    float dy = 1.0 / float(boneTextureSize);

    y = dy * (y + 0.5);

    vec4 v1 = texture2D(boneTexture, vec2(dx * (x + 0.5), y));
    vec4 v2 = texture2D(boneTexture, vec2(dx * (x + 1.5), y));
    vec4 v3 = texture2D(boneTexture, vec2(dx * (x + 2.5), y));
    vec4 v4 = texture2D(boneTexture, vec2(dx * (x + 3.5), y));

    mat4 bone = mat4(v1, v2, v3, v4);

    return bone;

}

void main() {

	// #include <begin_vertex>
    vec3 transformed = vec3(position);
    // #ifdef USE_ALPHAHASH
    //     vPosition = vec3(position);
    // #endif

	// #include <skinning_vertex>
    #ifdef USE_SKINNING // 拥有骨骼的模型需要计算才能获得位置
        mat4 boneMatX = getBoneMatrix1(skinIndex.x);
        mat4 boneMatY = getBoneMatrix1(skinIndex.y);
        mat4 boneMatZ = getBoneMatrix1(skinIndex.z);
        mat4 boneMatW = getBoneMatrix1(skinIndex.w);

        vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);

        vec4 skinned = vec4(0.0);
        skinned += boneMatX * skinVertex * skinWeight.x;
        skinned += boneMatY * skinVertex * skinWeight.y;
        skinned += boneMatZ * skinVertex * skinWeight.z;
        skinned += boneMatW * skinVertex * skinWeight.w;

        transformed = (bindMatrixInverse * skinned).xyz;

    #endif
    vPositionOS = transformed;

    vec4 mvPosition = vec4(transformed, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    vPositionWS = (modelMatrix * mvPosition).xyz;
    gl_Position = projectionMatrix * mvPosition;
    // 

    // 法线方向
    vec3 objectNormal = vec3(normal);
    // #ifdef USE_TANGENT
    //     vec3 objectTangent = vec3(tangent.xyz);
    // #endif

    #ifdef USE_SKINNING
        mat4 skinMatrix = mat4(0.0);
        skinMatrix += skinWeight.x * boneMatX;
        skinMatrix += skinWeight.y * boneMatY;
        skinMatrix += skinWeight.z * boneMatZ;
        skinMatrix += skinWeight.w * boneMatW;
        skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
        objectNormal = vec4(skinMatrix * vec4(objectNormal, 0.0)).xyz;
        // #ifdef USE_TANGENT
        //     objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
        // #endif
    #endif
    vNormalOS = objectNormal;
    vNormalWS = normalize(modelMatrix * vec4(objectNormal, 0.0)).xyz;

    // 相机方向
    vViewPosition = -mvPosition.xyz;
}