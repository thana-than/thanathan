import React from 'react';
import ShootingStar from '@/components/ShootingStar.jsx';
import { Canvas } from '@react-three/fiber'

const Decorations = () => {
    return (
        //TODO right now the commented out div is stopping click throughs. Fix this before proceeding
        <></>
        // <div style={{
        //     position: 'absolute',
        //     width: '100%',
        //     height: '100%',
        //     overflow: 'clip'
        // }}>
        //     <div style={{
        //         height: '1000px',
        //     }}>
        //         <Canvas>
        //             <ambientLight />
        //             <ShootingStar href="https://fuckeduplittleguy.com" scale=".05" speed="1" />
        //         </Canvas>
        //     </div>
        // </div>
    );
}

export default Decorations;