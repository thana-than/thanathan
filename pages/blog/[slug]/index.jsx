import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';

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
    return (
        //TODO img if defined, if not use something default? idk
        <article>
            {/* <img src={`${directus.url}assets/${post.image.filename_disk}?width=600`} alt="" /> */}
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>
    );
}
