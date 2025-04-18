import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://cms.thanserver.ca').with(
    rest()
    // rest({
    //     onRequest: (options) => ({ ...options, cache: 'no-store' }),
    // })
);

export default directus;