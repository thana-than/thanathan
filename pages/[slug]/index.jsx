import directus from '@/lib/directus';
import { notFound } from 'next/navigation';
import { readItems } from '@directus/sdk';
import { getDisplayTitle } from '@/lib/blogPost';

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

// Fetch all available slugs for static generation
export async function getStaticPaths() {
    const pages = await directus.request(
        readItems('pages', {
            fields: ['slug'], // Only fetching the slugs
        })
    );

    // Generate paths for each slug
    const paths = pages.map((page) => ({
        params: { slug: page.slug },
    }));

    return {
        paths,
        fallback: false, // Or 'blocking' if you want to wait for data
    };
}

// Fetch page data based on the slug
export async function getStaticProps({ params }) {
    const { slug } = params;
    const page = await getPage(slug);

    if (!page) {
        return { notFound: true }; // Return 404 if the page is not found
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
            <h1>{getDisplayTitle(page)}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content || '' }}></div>
        </div>
    );
}