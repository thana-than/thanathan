import { createDirectus, staticToken, rest } from '@directus/sdk';
import { readItems } from '@directus/sdk';

const token = process.env.DIRECTUS_TOKEN;
let cms = process.env.CMS_URL || 'https://cms.thanserver.lan';

const directus = createDirectus(cms)
    .with(staticToken(token))
    .with(rest());

export default directus;

export async function getPage(slug) {
    try {
        const pages = await directus.request(readItems('pages', {
            filter: { 'slug': { '_eq': slug } },
            limit: 1
        }));
        return pages[0];
    } catch (error) {
        // notFound();
        console.log(error);
        return null;
    }
}