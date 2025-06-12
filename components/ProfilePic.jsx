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
        <a href="/" className='page__header-profilePic'>
            <video
                ref={videoRef}
                poster="/profile.png"
                src="/profile.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
        </a>
    );
}