#include "lygia/generative/voronoi.glsl"
precision mediump float;

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
float scrollSpeed = .005;
float flickerSpeed = .4;
vec2 sizeMinMax = vec2(.7,.9);
float scaleMult = 1.2;
float uvScale = 50.0;
float sharpness = 2.0;
float bloom = 0.8;
vec2 autoScroll = vec2(0.0, -1.0);
float mouseShrink = .75;
float mouseClickResonateTime = .333;
float mouseClickFlash = .2;
float mouseVoronoiAffect = 0.1;
float middleAlpha = 0.85;
float voronoiScrollAffect = 0.06;
float mousePassivePush = 1.0;
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
    float vorPos = scrollVoronoi + uTime * voronoiTimeShift + mouseRamp * mouseVoronoiAffect;
    vec3 vor = 1.0 - voronoi(starMap, vorPos);
    float samp = vor.z;
    vec2 dimensionality = vor.xy;
    float flicker = sin((dimensionality.x + uTime) * PI * dimensionality.y * flickerSpeed) * 0.5 + 0.5;
    float size = mix(sizeMinMax.x, sizeMinMax.y, dimensionality.x) * scaleMult;
    float noise = smoothstep(size,1.333,samp);
    float stars = noise * flicker * sharpness;
    vec3 starColor = vec3(dimensionality.x, .2, dimensionality.y) + bloom;
    float fade = vUv.y;
    float middleAlphaWave = clamp(sin(vUv.x * PI) * 0.5 + 0.5,0.0,1.0);
    fade *= 1.0 - middleAlphaWave * middleAlpha;
    
    float alpha = stars * fade; 
    vec4 col = vec4(starColor.xyz * alpha, alpha);
    //col = vec4(vor.x);
    gl_FragColor = col;
}