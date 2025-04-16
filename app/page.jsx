import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';

async function getGlobals() {
    return directus.request(readItems('global'));
}

export default async function HomePage() {
    const global = await getGlobals();
    return (
        <div>
            <h1>{global.Test}</h1>
        </div>
    );
}