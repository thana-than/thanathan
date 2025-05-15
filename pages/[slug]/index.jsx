import { getPage, getSlugPaths } from '@/lib/cms';
import reservedSlugs from '@/lib/reservedSlugs';

export async function getStaticPaths() {
    return await getSlugPaths('pages', { 'slug': { '_nin': reservedSlugs } });
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