import directus, { getPage } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import reservedSlugs from '@/lib/reservedSlugs';

export async function getStaticPaths() {
    const pages = await directus.request(
        readItems('pages', {
            fields: ['slug'],
        })
    );

    const paths = pages.filter((item) => !reservedSlugs.includes(item.slug)).map((page) => ({
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