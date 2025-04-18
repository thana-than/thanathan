import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';

//* See https://directus.io/docs/tutorials/getting-started/fetch-data-from-directus-with-nextjs

async function getPosts() {
    return directus.request(
        readItems('posts', {
            fields: ['slug', 'title', 'date_created', { author: ['name'] }],
            sort: ['-date_created'],
        })
    );
}

export const getStaticProps = async () => {
    const posts = await getPosts();
    return {
        props: {
            posts,
        },
    };
};

export default function BlogPage({ posts }) {
    return (
        <div>
            <h1>Blog</h1>
            <ul>
                {posts.map((post) => {
                    return (
                        <li key={post.slug}>
                            <h2>
                                <a href={`/blog/${post.slug}`}>
                                    {post.title}
                                </a>
                            </h2>
                            <span>
                                {post.date_created} &bull; {post.author.name}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}