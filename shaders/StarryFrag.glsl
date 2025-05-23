#include "lygia/generative/voronoi.glsl"
#include "lygia/generative/worley.glsl"

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAspect;
uniform float uScrollY;
uniform float uWidth;
uniform float uHeight;
uniform vec2 uMouse;
uniform float uMouseClickTime;

varying vec2 vUv;
float scrollSpeed = .1;
float flickerSpeed = .77;
vec2 sizeMinMax = vec2(.73,.78);
float uvScale = 125.0;
float sharpness = 2.0;
float bloom = .5;
vec2 autoScroll = vec2(0.0, -2.0);
float mouseShrink = .5;
float mouseClickResonateTime = 1.0;
float mouseClickFlash = .2;

void main() {
    float mult = (uHeight / 1080.0);
    float vScroll = uScrollY * scrollSpeed;
    vec2 aspectUV = vec2(vUv.x * uAspect, vUv.y - vScroll) * mult;
    vec2 mouseUV = vec2(uMouse.x * uAspect, uMouse.y - vScroll) * mult;
    float mouseRamp = sin(smoothstep(mouseShrink, 1.0, 1.0 - distance(aspectUV, mouseUV)));
    float mouseClick = sin(smoothstep(0.0,mouseClickResonateTime, uMouseClickTime));

    vec2 starMap = aspectUV * uvScale + autoScroll * uTime;
    starMap += mouseUV * mouseRamp;
    vec3 voronoi = 1.0 - voronoi(starMap, 0.0);
    float flicker = (sin((voronoi.x + uTime) * PI * voronoi.y * flickerSpeed) + 1.0) * 0.5;
    float size = mix(sizeMinMax.x, clamp(sizeMinMax.y + (1.0 - mouseClick) * mouseClickFlash,0.0,1.0), voronoi.x - mouseRamp);
    float noise = smoothstep(size,1.0,sin(voronoi.z));
    float stars = noise * flicker * sharpness;
    vec3 starColor = vec3(worley2(starMap).xyy) + bloom;
    float fade = vUv.y;
    float alpha = stars * fade; 
    vec4 col = vec4(starColor.xyz * alpha, alpha);

    gl_FragColor = col;
}