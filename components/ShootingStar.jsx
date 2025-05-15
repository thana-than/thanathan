import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';

const ShootingStar = (props) => {
    const speed = props.speed || 1;
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    // const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        const rot = delta * speed;
        ref.current.rotation.y += rot;
        ref.current.rotation.z += rot;

        ref.current.position.x += delta;

        //TODO proper wrapping here
        // const z = 0;
        // const leftEdge = new THREE.Vector3(-window.outerWidth, 0, z).unproject(state.camera);
        // const rightEdge = new THREE.Vector3(1, 0, z).project(state.camera);

        // if (ref.current.position.x > rightEdge.x + 1) {
        //     ref.current.position.x = leftEdge.x - 1;
        // }
    });

    //* Open given href link
    const handleClick = () => {
        if (!props.href)
            return;
        // click(!clicked);
        window.open(props.href, '_blank');
    }

    //* Sets the cursor to pointer when hovering
    useEffect(() => {
        if (!props.href)
            return;
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, [hovered]);

    const scale = props.scale || .1;
    return (
        <mesh
            {...props}
            ref={ref}
            scale={1}
            position={[-1, 0, 0]}
            onClick={(event) => { handleClick() }}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <octahedronGeometry args={[scale]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

export default ShootingStar;