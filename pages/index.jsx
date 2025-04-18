import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';

async function getGlobals() {
    return directus.request(readItems('global'));
}

export const getStaticProps = async () => {
    const global = await getGlobals();
    return {
        props: {
            global,
        },
    };
};

export default function HomePage({ global }) {
    return (
        <div>
            <h1>{global.Test}</h1>
        </div>
    );
}