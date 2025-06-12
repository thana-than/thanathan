const { request } = require('../lib/cms.ts');
const { getCategorySlug } = require('../lib/formatting.js');
const fs = require('fs');
const path = require('path');

const outputLocation = '../public/rss.xml'
const channel = {
    url: "https://thanathan.com",
    title: "ThanaThan.com",
    desc: "I'm an artist with a focus on game development.",
    copyright: "ThanaThan",
    language: 'en',
    rssUrl: "https://thanathan.com/rss.xml",
};

function escape(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function fetchData() {
    //* Posts consist of our blog
    let posts = await request('posts', {
        fields: ['slug', 'title', 'subtitle', 'date_published', { author: ['name', 'email'] }],
        sort: ['-date_published'],
    });

    //* Items consist of other page content entries (ie. art, games)
    let items = await request('item', {
        fields: ['link', 'title', 'date_published', { project_type: ['name'] }, { team: ['name', 'email'] }],
        sort: ['-date_published'],
    });

    //* Unify both posts and items so they share the same required parameters
    posts = posts.map((post: any) => {
        const projectType = { name: "blog" };
        const domain = `${channel.url}/${getCategorySlug(projectType.name)}`;
        const link = `${domain}/${post.slug}`
        return {
            ...post,
            project_type: projectType,
            domain: domain,
            link: link,
            description: `${post.subtitle}`,
            guid: { isPermaLink: true, guid: link },
        };
    });


    items = items.map((item: any) => ({
        ...item,
        author: item.team,
        domain: `${channel.url}/${getCategorySlug(item.project_type.name)}`,
        description: `${item.project_type.name}`,
        guid: { isPermaLink: false, guid: escape(`${item.title}-${item.date_published}`) },
    }));

    //* Combine into one data array and sort by date descending
    const data = [...posts, ...items];
    data.sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());
    return data;
}

async function generateRSS() {
    const data = await fetchData();

    const rssPosts = data.map((obj: any) => {
        return `
<item>
    <title>${escape(obj.title)}</title>
    <author>${obj.author.email} (${obj.author.name})</author>
    <link>${obj.link}</link>
    <pubDate>${new Date(obj.date_published).toUTCString()}</pubDate>
    <description>${obj.description}</description>
    <category domain="${obj.domain}">${obj.project_type.name}</category>
    <guid isPermaLink="${obj.guid.isPermaLink}">${obj.guid.guid}</guid>
</item>
    `;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>${channel.title}</title>
    <link>${channel.url}</link>
    <atom:link href="${channel.rssUrl}" rel="self" type="application/rss+xml"/>
    <description>${channel.desc}</description>
    <language>${channel.language}</language>
    <copyright>${channel.copyright}</copyright>
    ${rssPosts}
</channel>
</rss>`;

    fs.writeFileSync(path.join(__dirname, '../public/rss.xml'), rss);
    console.log('RSS feed generated!');
}

generateRSS();