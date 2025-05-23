import React from 'react';
// import ShootingStar from '@/components/ShootingStar.jsx';
import BackgroundMaterial from '@/components/BackgroundMaterial.jsx';
import StarryBackground from '@/components/StarryBackground';
import { Canvas } from '@react-three/fiber'

const Decorations = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'visible',
            zIndex: -1000,
            pointerEvents: "none"
        }}>
            {/* //TODO right now the canvas doesn't accept pointerEvents or else it will block off the page contents
            //TODO raycasting might work, but is also expensive? 
            */}
            <Canvas style={{ pointerEvents: "none" }}>
                <ambientLight />
                <StarryBackground />
                {/* <ShootingStar href="https://fuckeduplittleguy.com" scale=".05" speed="1" /> */}
            </Canvas>
        </div>
    );
}

export default Decorations;