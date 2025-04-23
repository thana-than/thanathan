import React from 'react'
import { Breadcrumbs, FooterNav } from '@/components/Nav';
import Link from 'next/link';

const scrollFadeMargin = 10;
const defaultHeaderHeight = 115.2;

export const Block = React.forwardRef(({ children, outer_classes, inner_classes }, ref) => {
    return (
        <div className={`page__outer ${outer_classes}`} >
            <div className={`page__wrapper ${inner_classes}`} ref={ref}>
                {children}
            </div>
        </div>
    );
});

export function Header({ title, subHead }) {
    const [showGradient, setShowGradient] = React.useState(false);

    const headerRef = React.useRef(null);
    const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

    React.useEffect(() => {
        if (!headerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setHeaderHeight(entry.contentRect.height);
        });

        observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, [headerRef, headerHeight]);


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
            return <Breadcrumbs className="page__header-entry" />;
        }
    };

    return (
        <>
            <div className='page__header-spaceHolder' style={{ height: headerHeight }}></div>
            <div className='page__wrapper page__header' ref={headerRef}>
                <div className='page__header-border'></div>
                <div className={`page__header-gradient ${showGradient ? '' : 'hidden'}`}></div>
                <h1 className='page__header-entry page__title'>{title || 'Thanathan'}</h1>
                <RenderSubHead />
            </div>
        </>
    );
};

export function Main({ children }) {
    return (
        <Block outer_classes="page__main">
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
            <div className='page__footer-border'></div>
            {/* <div className={`page__footer-gradient ${showGradient ? '' : 'hidden'}`}></div> */}
        </Block>
    );
}