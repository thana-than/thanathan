import { getPage } from '@/lib/cms';

export const getStaticProps = async () => {
    const homepage = await getPage('homepage');

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