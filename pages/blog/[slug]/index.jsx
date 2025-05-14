import directus, { parseContent, downloadFile } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { formatDate } from '@/lib/formatting';

//* Get a single post by slug
async function getPost(slug) {
    const posts = await directus.request(
        readItems('posts', {
            filter: { slug: { _eq: slug } },
            fields: ['title', 'content', 'date_published', 'image', { author: ['name'] }],
            limit: 1,
        })
    );

    const item = posts[0];
    if (!item)
        return null;

    if (item.content) {
        item.content = await parseContent(item.content);
    }

    if (item.image) {
        item.image = await downloadFile(item.image);
    }

    return item;
}

//* Get all slugs for static generation
export async function getStaticPaths() {
    const posts = await directus.request(
        readItems('posts', {
            fields: ['slug'],
        })
    );

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }));

    return {
        paths,
        fallback: false,
    };
}

//* Fetch post data based on slug
export async function getStaticProps({ params }) {
    const post = await getPost(params.slug);

    if (!post) {
        return { notFound: true };
    }

    return {
        props: {
            post,
        },
    };
}

export default function Page({ post }) {
    const author = post?.author?.name || "Than";
    return (
        //TODO img if defined, if not use something default? idk
        <article>
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            <div className='page__author'>by {author} on {formatDate(post.date_published)}</div>
        </article>
    );
}
