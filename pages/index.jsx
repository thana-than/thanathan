import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';


export const getStaticProps = async () => {
    const homepage = await directus.request(readItems('homepage'));
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