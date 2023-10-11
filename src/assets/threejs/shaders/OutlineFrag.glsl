varying vec3 vViewPosition;
varying highp vec3 vNormalOS;
varying highp vec3 vNormalWS;
varying highp vec3 vPositionOS;
varying highp vec3 vPositionWS;

uniform vec3 color;

#define saturate( a ) clamp( a, 0.0, 1.0 )
void main() {
    float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
    vec3 normal = normalize(vNormalOS);
    // #ifdef DOUBLE_SIDED
    //     normal *= faceDirection;
	// #endif

    // vec3 posVS = -vViewPosition;
    // vec3 viewDir = normalize(vViewPosition);
    vec3 viewPosWS = cameraPosition; // cameraPosition 内置变量, 
    vec3 viewDir = normalize(viewPosWS - vPositionWS); 

    // float dotNH = saturate(dot(normal, halfDir));
    // float dotVH = saturate(dot(viewDir, halfDir));
    float dotNV = saturate(dot(vNormalWS, viewDir));
    dotNV = saturate( pow(dotNV, 2.2)  * 0.7 + 0.3);
    
    float rim = pow(1.0 - dotNV, 5.0);

    // gl_FragColor = vec4(1.0);
    gl_FragColor = vec4(viewDir * color.xyz, 1.0) * 1.0;
    gl_FragColor = vec4(vec3(dotNV) * color.xyz, 1.0) * 1.0;
    // gl_FragColor = vec4(vec3(rim), 1.0);
    // gl_FragColor = vec4(viewDir, 1.0);
}