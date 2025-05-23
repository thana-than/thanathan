import React, { useEffect, useRef, useState } from 'react'
import { shaderMaterial } from '@react-three/drei';
import { extend, useThree, useFrame } from '@react-three/fiber';
import basicVertexShader from '@/shaders/BasicVert.glsl';
import basicFragmentShader from '@/shaders/UVFrag.glsl';

const DefaultMaterial = shaderMaterial(
    //* Uniform
    {},
    //* Vertex Shader
    basicVertexShader,
    //* Fragment Shader
    basicFragmentShader
);
extend({ DefaultMaterial });

const BackgroundMaterial = ({ materialName = "defaultMaterial" }) => {
    const { viewport, size, camera, gl } = useThree();
    const [mouseClickTime, setMouseClickTime] = useState(10000000.0);
    const tagName = materialName.charAt(0).toLowerCase() + materialName.slice(1);
    const ref = useRef();

    useEffect(() => {
        const aspect = size.width / size.height;
        const height = size.height;
        const width = size.width;

        ref.current.uWidth = width;
        ref.current.uHeight = height;
        ref.current.uAspect = aspect;
    }, [size, camera, ref.current]);


    useEffect(() => {
        const handleScroll = () => {
            const scrollOffset = scrollY / window.innerHeight;
            const scrollSpaceY = scrollOffset * viewport.height;
            ref.current.uScrollY = scrollSpaceY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.uTime = state.clock.getElapsedTime();
            setMouseClickTime(mouseClickTime + delta);
            ref.current.uMouseClickTime = mouseClickTime;
        }
    });

    useEffect(() => {
        const handleMouseMove = (event) => {
            const rect = gl.domElement.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = 1 - (event.clientY - rect.top) / rect.height;

            ref.current.uMouse = [x, y]; // UV coordinates
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [gl]);

    useEffect(() => {
        const handleMouseClick = (event) => {
            setMouseClickTime(0);
        };

        window.addEventListener('mousedown', handleMouseClick);
        return () => window.removeEventListener('mousedown', handleMouseClick);
    }, [gl]);

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height]} />
            {React.createElement(tagName, { attach: "material", ref })}
        </mesh>
    );
}
export default BackgroundMaterial;