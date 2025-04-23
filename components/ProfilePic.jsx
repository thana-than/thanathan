import React from 'react';

export default function ProfilePic({ playVideo }) {
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (videoRef.current) {
            if (playVideo) {
                videoRef.current.play().catch((err) => {
                    console.error("Video play failed:", err);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [playVideo]);

    return (
        <>
            <video ref={videoRef} className='page__header-profilePic' poster="/profile.png" src="/profile.mp4" autoPlay muted loop playsInline />
        </>
    );
}