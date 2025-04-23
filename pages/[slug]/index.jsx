import directus from '@/lib/directus';
import { notFound } from 'next/navigation';
import { readItems } from '@directus/sdk';

async function getPage(slug) {
    try {
        const pages = await directus.request(readItems('pages', {
            filter: { 'slug': { '_eq': slug } },
            limit: 1
        }));
        return pages[0];
    } catch (error) {
        notFound();
    }
}

export async function getStaticPaths() {
    const pages = await directus.request(
        readItems('pages', {
            fields: ['slug'],
        })
    );

    const paths = pages.map((page) => ({
        params: { slug: page.slug },
    }));

    return {
        paths,
        fallback: false,
    };
}

// Fetch page data based on the slug
export async function getStaticProps({ params }) {
    const { slug } = params;
    const page = await getPage(slug);

    if (!page) {
        return { notFound: true };
    }

    return {
        props: {
            page,
        },
    };
}

export default function Page({ page }) {
    if (!page) {
        return <div>Page not found</div>;
    }
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: page.content || '' }}></div>
        </div>
    );
}