import BackgroundMaterial from "./BackgroundMaterial";
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vert from '@/shaders/BasicVert.glsl';
import frag from '@/shaders/StarryFrag.glsl';

const StarryMaterial = shaderMaterial(
    //* Uniform
    { uTime: 0, uAspect: 1, uMouse: [0, 0], uMouseClickTime: 100000, uScrollY: 0, uWidth: 1920, uHeight: 1080 },
    //* Vertex Shader
    vert,
    //* Fragment Shader
    frag
);
extend({ StarryMaterial });

const StarryBackground = (props) => <BackgroundMaterial materialName="starryMaterial" />;
export default StarryBackground;