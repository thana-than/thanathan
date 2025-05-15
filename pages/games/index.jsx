import PageLayout from '@/components/ItemPage.jsx';
import { getItemPage } from '@/lib/cms';

export async function getStaticProps() {
    return await getItemPage('games', { 'project_type': { '_eq': 1 } });
}

export default function Page({ page, items }) {
    return (
        <PageLayout page={page} items={items} />
    );
}