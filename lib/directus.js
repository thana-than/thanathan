import { createDirectus, staticToken, rest, readAssetRaw, readFile } from '@directus/sdk';
import { readItems } from '@directus/sdk';
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const token = process.env.DIRECTUS_TOKEN;
const cms = process.env.CMS_URL || 'https://cms.thanserver.lan';
const cmsAssetsUrl = `${cms.replace(/^(https?:\/*)/, '')}/assets/`;
const localCMSPath = '/.cms/';

const directus = createDirectus(cms)
    .with(staticToken(token))
    .with(rest());

export default directus;

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

export async function downloadFile(fileId) {
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

export async function downloadFiles(items, key) {
    for (const item of items) {
        if (item[key]) {
            item[key] = await downloadFile(item[key]);
        }
    }
    return items;
}

//* This method ensures that the given html content does not have any requirements from our content management server.
//* It will download the file src's in the html and update the link.
export async function parseContent(html) {
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

export async function getPage(slug) {
    try {
        const pages = await directus.request(readItems('pages', {
            filter: { 'slug': { '_eq': slug } },
            limit: 1
        }));

        if (pages[0].content) {
            pages[0].content = await parseContent(pages[0].content);
        }

        return pages[0];
    } catch (error) {
        // notFound();
        console.log(error);
        return null;
    }
}