import { createDirectus, staticToken, rest, readAssetRaw, readFile } from '@directus/sdk';
import { readItems } from '@directus/sdk';
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const token = process.env.DIRECTUS_TOKEN;
const cmsUrl = process.env.CMS_URL || 'https://cms.thanserver.lan';
const cmsAssetsUrl = `${cmsUrl.replace(/^(https?:\/*)/, '')}/assets/`;
const localCMSPath = '/.cms/';

const directus = createDirectus(cmsUrl)
    .with(staticToken(token))
    .with(rest());

interface Query {
    readonly fields?: (string | Record<string, any>)[] | undefined;
    filter?: Record<string, any> | undefined;
    search?: string | undefined;
    sort?: string | string[] | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    page?: number | undefined;
    deep?: Record<string, any> | undefined;
    readonly alias?: Record<string, string> | undefined;
}

/**
 * Runs a basic Directus request to using the readItems command. Also tries to download and convert server side file links to keep the page static.
 *
 * @param collection The collection of the items
 * @param query The query parameters
 * @param htmlFields Optional set of fields that should attempt to have content converted to static
 * @param fileFields Optional set of fields that should attempt to be converted to static files
 *
 * @returns An array of up to limit item objects. If no items are available, data will be an empty array.
 * @throws Will throw if collection is a core collection
 * @throws Will throw if collection is empty
 */
export async function request(
    collection: string,
    query?: Query,
    htmlFields: string[] = ['content', 'html'],
    fileFields: string[] = ['thumbnail', 'image', 'video']
): Promise<Record<string, any>[]> {

    let items = await directus.request(
        readItems(collection, query)
    );

    //* Because we want to run the site staticly, we need to parse download any files during build time and update the links so they remain static
    for (const item of items) {
        if (htmlFields) {
            for (const field of htmlFields) {
                if (item[field])
                    item[field] = await transformHTML(item[field]);
            }
        }
        if (fileFields) {
            for (const field of fileFields) {
                if (item[field])
                    item[field] = await downloadFile(item[field]);
            }
        }
    }
    return items;
}

export async function getPage(slug) {
    try {
        const page = (await request('pages', {
            filter: { 'slug': { '_eq': slug } },
            limit: 1
        }))[0];

        return page;
    } catch (error) {
        // notFound();
        console.log(error);
        return null;
    }
}

async function downloadFile(fileId) {
    const meta = await directus.request(
        readFile(fileId, {
            fields: ['id', 'filename_disk, modified_on'],
        })
    );

    const localPath = path.join('public', '.cms', meta.filename_disk);
    const publicPath = `${localCMSPath}${meta.filename_disk}`;

    //* If the file already exists locally and the server file hasn't been modified recently, just use the existing file
    if (fs.existsSync(localPath)) {
        const server_lastModified = new Date(meta.modified_on);
        const local_lastModified = new Date(fs.statSync(localPath).mtime);
        if (server_lastModified < local_lastModified) {
            return publicPath;
        }
    }

    const stream = await directus.request(readAssetRaw(fileId));
    const buffer = await streamToBuffer(stream);

    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, buffer);

    return publicPath;
}

//* This method ensures that the given html content does not have any requirements from our content management server.
//* It will download the file src's in the html and update the link.
async function transformHTML(html) {
    const $ = cheerio.load(html);
    const elements = $('[src]').toArray();

    for (const el of elements) {
        const src = $(el).attr('src');
        const regex = new RegExp(`${cmsAssetsUrl}([a-f0-9\\-]+)`);
        const match = src.match(regex);
        if (match) {
            const id = match[1];
            const newSrc = await downloadFile(id);
            $(el).attr('src', newSrc);
        }
    }

    const outHTML = $.html();
    return outHTML;
}

async function streamToBuffer(stream) {
    const reader = stream.getReader();
    const chunks = [];
    let result;

    while (!(result = await reader.read()).done) {
        chunks.push(result.value);
    }

    return Buffer.concat(chunks.map(chunk =>
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    ));
}