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
    // const mouseRef = useRef([NaN, NaN]);
    // const smoothMouseRef = useRef([NaN, NaN]);
    const mouseClickTimeRef = useRef(10000000.0);
    const tagName = materialName.charAt(0).toLowerCase() + materialName.slice(1);
    const ref = useRef();
    const smoothMouseSpeed = 2.0;

    useEffect(() => {
        const aspect = size.width / size.height;
        const height = size.height;
        const width = size.width;

        ref.current.uWidth = width;
        ref.current.uHeight = height;
        ref.current.uAspect = aspect;
    }, [size, camera]);

    function moveTowards(currentPosition, targetPosition, delta) {
        // Calculate the vector from the current position to the target position.
        const direction = [
            targetPosition[0] - currentPosition[0],
            targetPosition[1] - currentPosition[1]
        ];

        // Calculate the distance to the target.
        const distance = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]);

        // If the distance is less than the speed multiplied by delta time, move directly to the target.
        if (distance <= delta) {
            return targetPosition;
        }

        // Normalize the direction vector.
        const normalizedDirection = [
            direction[0] / distance,
            direction[1] / distance
        ];

        // Calculate the movement increment based on speed and delta time.
        const increment = [
            normalizedDirection[0] * delta,
            normalizedDirection[1] * delta
        ];

        // Return the new position.
        return [
            currentPosition[0] + increment[0],
            currentPosition[1] + increment[1]
        ];
    }

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
            ref.current.uTime = state.clock.getElapsedTime();

            // let movement = moveTowards(smoothMouseRef.current, mouseRef.current, delta * smoothMouseSpeed);
            // if (!movement[0])
            //     movement = mouseRef.current;
            // smoothMouseRef.current = movement;
            // ref.current.uSmoothMouse = movement;

            mouseClickTimeRef.current += delta;
            ref.current.uMouseClickTime = mouseClickTimeRef.current;
        }
    });

    useEffect(() => {
        const handleMouseMove = (event) => {
            const rect = gl.domElement.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = 1 - (event.clientY - rect.top) / rect.height;
            // mouseRef.current = [x, y];
            ref.current.uMouse = [x, y];
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleMouseClick = (event) => {
            mouseClickTimeRef.current = 0;
        };

        window.addEventListener('mousedown', handleMouseClick);
        return () => window.removeEventListener('mousedown', handleMouseClick);
    }, []);

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height]} />
            {React.createElement(tagName, { attach: "material", ref })}
        </mesh>
    );
}
export default BackgroundMaterial;