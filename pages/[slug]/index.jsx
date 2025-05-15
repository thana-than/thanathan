import { request, getPage } from '@/lib/cms';
import reservedSlugs from '@/lib/reservedSlugs';

export async function getStaticPaths() {
    const pages = await request('pages', {
        fields: ['slug'],
        filter: { 'slug': { '_nin': reservedSlugs } }
    });

    const paths = pages.map((page) => ({
        params: { slug: page.slug },
    }));

    return {
        paths,
        fallback: false,
    };
}

//* Fetch page data based on the slug
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