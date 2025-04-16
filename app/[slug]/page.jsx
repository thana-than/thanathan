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

export default async function DynamicPage({ params }) {
    const { slug } = await params;
    const page = await getPage(slug);
    return (
        <div>
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content || '' }}></div>
        </div>
    );
}