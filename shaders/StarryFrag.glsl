#include "lygia/generative/voronoi.glsl"
precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAspect;
uniform float uScrollY;
uniform float uWidth;
uniform float uHeight;
uniform vec2 uMouse;
uniform vec2 uSmoothMouse;
uniform float uMouseClickTime;

varying vec2 vUv;
float scrollSpeed = .01;
float flickerSpeed = .1;
float flickerDiff = 10.0;
vec2 sizeMinMax = vec2(0.85,1.0);
float scaleDiff = 1.0;
float uvScale = 75.0;
float sharpness = 2.0;
float bloom = 1.5;
vec2 autoScroll = vec2(0.0, -.22);
float mouseShrink = .75;
float mouseClickResonateTime = .333;
float mouseClickFlash = .2;
float mouseVoronoiAffect = 0.3;
float middleAlpha = 0.93;
float voronoiScrollAffect = 0.03;
float mousePassivePush = 1.33;
float mousePush = -10.0;
float voronoiTimeShift = 0.1;

void main() {
    float mult = (uHeight / 1080.0);
    float vScroll = uScrollY * scrollSpeed;
    float scrollVoronoi = uScrollY * voronoiScrollAffect;
    vec2 aspectUV = vec2(vUv.x * uAspect, vUv.y) * mult;
    vec2 mouseUV = vec2(uMouse.x * uAspect, uMouse.y - vScroll) * mult;
    vec2 scrollUV = vec2(aspectUV.x, aspectUV.y - vScroll);

    float mouseDist = distance(aspectUV, mouseUV);
    float mouseRamp = clamp((1.0 - mouseDist - mouseShrink) / (1.0 - mouseShrink), 0.0, 1.0);
    //float mouseClickStep = smoothstep(0.0,mouseClickResonateTime, uMouseClickTime);
    //float mouseClick = 0.0;//clamp(sin(sqrt(mouseClickStep) * PI),0.0, 1.0);

    vec2 starMap = scrollUV * uvScale + autoScroll * uTime;
    starMap += (mouseUV - aspectUV) * mouseRamp * mousePassivePush;// + (mouseUV - aspectUV) * mouseRamp * mouseClick * mousePush;
    float vorPos = 10.0 + scrollVoronoi + uTime * voronoiTimeShift + mouseRamp * mouseVoronoiAffect;
    vec3 vor = 1.0 - voronoi(starMap, vorPos);
    float samp = vor.z;
    vec2 dimensionality = vor.xy;
    float flicker = sin((dimensionality.x * flickerDiff + dimensionality.y * flickerDiff + uTime) * PI * flickerSpeed)  * 0.5 + 0.5;
    float size = mix(sizeMinMax.x, sizeMinMax.y, dimensionality.x);
    float noise = sin(smoothstep(size,1.333,samp) * PI);
    float stars = noise * flicker * sharpness;
    vec3 starColor = vec3(sin(dimensionality.x * flickerDiff * PI), .2, sin(dimensionality.y * flickerDiff * PI)) + bloom;
    float fade = sin(vUv.y);
    float middleAlphaWave = clamp(sin(vUv.x * PI) * 0.5 + 0.5,0.0,1.0);
    fade *= 1.0 - middleAlphaWave * middleAlpha;
    
    float alpha = stars * fade; 
    vec4 col = vec4(starColor.xyz * alpha, alpha);
    //col = vec4(flicker);
    gl_FragColor = col;
}