import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Breadcrumbs, FooterNav } from '@/components/Nav';
import ProfilePic from '@/components/ProfilePic';

const scrollFadeMargin = 10;
const defaultHeaderHeight = 0;//115.2;

export const Block = React.forwardRef(({ children, outer_classes, inner_classes }, ref) => {
    return (
        <div className={`page__outer ${outer_classes}`} >
            <div className={`page__wrapper ${inner_classes}`} ref={ref}>
                {children}
            </div>
        </div>
    );
});

export function Mask({ children }) {
    const ref = React.useRef(null);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTop = scrollY;
            const fadeStart = scrollTop // max fade distance
            setShow(scrollY > scrollFadeMargin);

            ref.current.style.setProperty('--mask-start', `${fadeStart}px`)
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={ref}
            className={`page__mask ${show ? '' : 'page__maskOff'}`}
        >
            {children}
        </div>
    );
}

export function Header({ title, subHead, date }) {
    const router = useRouter();
    const isHome = router.pathname === '/';

    const [showGradient, setShowGradient] = React.useState(false);
    const [playVideo, setPlayVideo] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowGradient(window.scrollY > scrollFadeMargin);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const RenderSubHead = () => {
        if (subHead) {
            return (
                <div className="page__header-entry">
                    {typeof subHead === 'string' ? <>{subHead}</> : subHead}
                </div>
            );
        } else {
            return <Breadcrumbs />;
        }
    };

    return (
        <div className='page__wrapper page__header'
            onMouseEnter={() => setPlayVideo(true)}
            onMouseLeave={() => setPlayVideo(false)}
        >
            <div className='page__header-border'></div>
            {/* <div className={`page__header-gradient ${showGradient ? '' : 'hidden'}`}></div> */}
            <div className='page__header-block'>
                <ProfilePic playVideo={isHome || playVideo} />
                <div className='page__header-titles'>
                    <h1 className='page__header-entry page__title'>{title || 'Thanathan'}</h1>
                    <div className='page__header-sub'>
                        <RenderSubHead />
                        <div className='page__header-entry page__header-date'>{date}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function Main({ children }) {
    return (
        <Block key={Math.random()} outer_classes="page__main">
            {children}
        </Block>
    );
}

export function Footer() {
    const [showGradient, setShowGradient] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollBottom = window.scrollY + window.innerHeight;
            const bottom = document.documentElement.scrollHeight - scrollFadeMargin;

            setShowGradient(scrollBottom < bottom);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Block inner_classes="page__footer" outer_classes="page__footer-outer">
            <FooterNav className="page__footer-entry" />
            <Link className="page__footer-entry page__right" href='/'>thanathan.com</Link>
            <div className='page__footer-border'></div>
            {/* <div className={`page__footer-gradient ${showGradient ? '' : 'hidden'}`}></div> */}
        </Block>
    );
}