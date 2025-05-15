import { request } from '@/lib/cms';
import { formatDate } from '@/lib/formatting';

//* Get all slugs for static generation
export async function getStaticPaths() {
    const posts = await request('posts', { fields: ['slug'] });

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
    const post = (await request(
        'posts', {
        filter: { slug: { _eq: params.slug } },
        fields: ['title', 'content', 'date_published', 'image', { author: ['name'] }],
        limit: 1
    }))[0];

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
