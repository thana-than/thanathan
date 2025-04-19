import { createDirectus, staticToken, rest } from '@directus/sdk';

const token = process.env.DIRECTUS_TOKEN;
let cms = process.env.CMS_URL || 'https://cms.thanserver.lan';

const directus = createDirectus(cms)
    .with(staticToken(token))
    .with(rest());

export default directus;