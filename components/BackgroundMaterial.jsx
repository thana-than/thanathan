import React, { useEffect, useRef, useMemo } from 'react'
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
    const mouseClickTimeRef = useRef(10000000.0);
    const uTime = React.useRef(0);
    const tagName = materialName.charAt(0).toLowerCase() + materialName.slice(1);
    const ref = useRef();

    useEffect(() => {
        const aspect = size.width / size.height;
        const height = size.height;
        const width = size.width;

        ref.current.uWidth = width;
        ref.current.uHeight = height;
        ref.current.uAspect = aspect;
    }, [size, camera]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollOffset = scrollY / window.innerHeight;
            const scrollSpaceY = scrollOffset * viewport.height;
            ref.current.uScrollY = scrollSpaceY;
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            uTime.current = (uTime.current + delta) % 1000.0; //* Avoids precision loss by looping after 1000 seconds
            ref.current.uTime = uTime.current;

            mouseClickTimeRef.current += delta;
            ref.current.uMouseClickTime = mouseClickTimeRef.current;
        }
    });

    useEffect(() => {
        const handleMouseMove = (event) => {
            //* Only handle mouse movement if we're using a mouse;
            //? If we ever want to change this we should allow the child material to apply a filter
            if (event.pointerType !== 'mouse')
                return;

            const rect = gl.domElement.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = 1 - (event.clientY - rect.top) / rect.height;
            ref.current.uMouse = [x, y];
        };

        window.addEventListener('pointermove', handleMouseMove);
        return () => window.removeEventListener('pointermove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleMouseClick = (event) => {
            //* Only handle mouse click if we're using a mouse;
            //? If we ever want to change this we should allow the child material to apply a filter
            if (event.pointerType !== 'mouse')
                return;

            mouseClickTimeRef.current = 0;
        };

        window.addEventListener('pointerdown', handleMouseClick);
        return () => window.removeEventListener('pointerdown', handleMouseClick);
    }, []);

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height]} />
            {React.createElement(tagName, { attach: "material", ref })}
        </mesh>
    );
}
export default BackgroundMaterial;