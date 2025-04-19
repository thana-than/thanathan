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
            <h1>Hello, World!</h1>
            <h2>{global.Test}</h2>
        </div>
    );
}