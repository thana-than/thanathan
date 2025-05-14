import directus, { parseContent } from '@/lib/directus';
import { readItems } from '@directus/sdk';


export const getStaticProps = async () => {
    const homepage = await directus.request(readItems('homepage'));

    homepage.content = await parseContent(homepage.content);

    return {
        props: {
            homepage
        },
    };
};


export default function HomePage({ homepage }) {
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: homepage.content || '' }}></div>
        </>
    );
}