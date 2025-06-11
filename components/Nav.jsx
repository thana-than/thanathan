import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navSpace = ' - ';
const breadcrumbSpace = ' >> ';
const homeBreadcrumbName = 'than';

export function HomeNav({ className }) {
    return (
        <nav className={`page__nav ${className}`}>
            <Link className="page__nav-link" href="/blog">blog</Link>
            {navSpace}
            <Link className="page__nav-link" href="/games">games</Link>
            {navSpace}
            <Link className="page__nav-link" href="/art">art</Link>
        </nav >
    );
}

export function FooterNav({ className }) {


    return (
        <nav className={`page__nav ${className}`}>
            {/* <Link className="page__nav-link" href='/'>home</Link>
            {navSpace} */}
            <Link className="page__nav-link" href='/contact'>contact</Link>
            {navSpace}
            <Link className="page__nav-link" href='/resume'>resume</Link>
            {navSpace}
            <Link className="page__nav-link" href='/rss.xml'>rss</Link>
        </nav >
    );
}

export function Breadcrumbs({ className }) {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = React.useState([]);

    React.useEffect(() => {
        if (router.isReady) {
            const pathSegments = router.asPath.split('/').filter(Boolean);

            const crumbs = pathSegments.map((segment, index) => {
                const href = '/' + pathSegments.slice(0, index + 1).join('/');
                const label = decodeURIComponent(segment).replace(/-/g, ' ').toLowerCase();

                return { href, label };
            });

            setBreadcrumbs(crumbs);
        }
    }, [router.isReady, router.asPath]);

    if (breadcrumbs.length === 0) return <HomeNav />;

    return (
        <nav className={`page__breadcrumbs ${className}`} >
            <Link className="page__breadcrumbs-link" href="/">{homeBreadcrumbName}</Link>
            {breadcrumbs.map((crumb, idx) => (
                <span key={idx}>
                    {breadcrumbSpace}
                    <Link className="page__breadcrumbs-link" href={crumb.href}>
                        {crumb.label}
                    </Link>
                </span>
            ))}
        </nav>
    );
}