import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { getDisplayTitle } from '@/lib/blogPost';

//* Get a single post by slug
async function getPost(slug) {
    const posts = await directus.request(
        readItems('posts', {
            filter: { slug: { _eq: slug } },
            //fields: ['title', 'content', 'image', { author: ['name'] }],
            limit: 1,
        })
    );
    return posts[0] || null;
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
        fallback: false, // Or 'blocking' if you want fallback support
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

export default function DynamicPage({ post }) {
    return (
        //TODO img if defined, if not use something default? idk
        <article>
            {/* <img src={`${directus.url}assets/${post.image.filename_disk}?width=600`} alt="" /> */}
            <h1>{getDisplayTitle(post)}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>
    );
}
