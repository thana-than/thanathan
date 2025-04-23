import Link from 'next/link';
import { useRouter } from 'next/router';

const navSpace = ' - ';
const breadcrumbSpace = ' >> ';

export function HomeNav({ className }) {
    return (
        <nav className={`page__nav ${className}`}>
            <Link className="page__nav-link" href="/games">Games</Link>
            {navSpace}
            <Link className="page__nav-link" href="/blog">Blog</Link>
        </nav >
    );
}

export function FooterNav({ className }) {
    return (
        <nav className={`page__nav ${className}`}>
            <Link className="page__nav-link" href='/about'>About</Link>
            {navSpace}
            <Link className="page__nav-link" href='/contact'>Contact</Link>
        </nav >
    );
}

export function Breadcrumbs({ className }) {
    const router = useRouter();
    const pathSegments = router.asPath.split('/').filter(Boolean);

    //* Build breadcrumb path parts
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = decodeURIComponent(segment).replace(/-/g, ' '); //* prettify

        return { href, label: label.toLowerCase() };
    });

    if (breadcrumbs.length == 0)
        return <HomeNav />;

    return (
        <nav className={`page__breadcrumbs ${className}`} >
            <Link className="page__breadcrumbs-link" href="/">thanathan</Link>
            {breadcrumbs.map((crumb, idx) => (
                <span key={idx}>
                    <>{breadcrumbSpace}</>
                    <Link className="page__breadcrumbs-link" href={crumb.href}>{crumb.label}</Link>
                </span>
            ))
            }
        </nav >
    );
}
