import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three';

const ShootingStar = (props) => {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const { camera } = useThree();

    // const [clicked, click] = useState(false)
    useFrame((state, delta) => {
        const rot = delta * .01;
        ref.current.rotation.y += rot;
        ref.current.rotation.z += rot;
        ref.current.position.x += rot;

        const pos = new THREE.Vector3(ref.current.position.x, ref.current.position.y, ref.current.position.z).project(state.camera);

        if (pos.x > 1) {
            hitEdge();
            pos.x = -1;
        }
        else if (pos.x < -1) {
            hitEdge();
            pos.x = 1;
        }

        if (pos.y > 1) {
            hitEdge();
            pos.y = -1;
        }
        else if (pos.y < -1) {
            hitEdge();
            pos.y = 1;
        }

        const newPos = pos.unproject(state.camera);
        ref.current.position.x = newPos.x;
    });

    const hitEdge = () => {

    }

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

    useEffect(() => {
        // Initialize the shooting star off-screen
        const initialPosition = new THREE.Vector3(-1, .5, 0);
        const unprojectedPosition = initialPosition.unproject(camera);
        ref.current.position.set(unprojectedPosition.x, unprojectedPosition.y, unprojectedPosition.z);
        //ref.current. = scale;
    }, [camera]);

    return (
        <mesh
            {...props}
            ref={ref}
            scale={.1}
            position={[-1, 0, 0]}
            onClick={(event) => { handleClick() }}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <octahedronGeometry args={[props.scale || .1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

export default ShootingStar;