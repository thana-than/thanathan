import PageLayout from '@/lib/itemPage.jsx';
import { getItemPage } from '@/lib/cms';

export async function getStaticProps() {
    return await getItemPage('art', { 'project_type': { '_neq': 1 } });
}

export default function Page({ page, items }) {
    return (
        <PageLayout page={page} items={items} />
    );
}