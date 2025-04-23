import directus from '@/lib/directus';
import Link from 'next/link';

export const getStaticProps = async () => {
    return {
        props: {
            'title': "Hi, I'm Than",
        },
    };
}

export default function HomePage() {
    return (
        <>
            <Link href='/blog'>Blog</Link>
        </>
    );
}