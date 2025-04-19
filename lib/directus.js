import { createDirectus, staticToken, rest } from '@directus/sdk';

const token = process.env.DIRECTUS_TOKEN;
const directus = createDirectus('https://cms.thanserver.lan')
    .with(staticToken(token))
    .with(rest());

export default directus;