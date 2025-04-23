import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { getDisplayTitle } from '@/lib/props';
import Link from 'next/link';

//* See https://directus.io/docs/tutorials/getting-started/fetch-data-from-directus-with-nextjs

async function getPosts() {
    return directus.request(
        readItems('posts', {
            fields: ['slug', 'title', 'date_created', 'status', { author: ['name'] }],
            sort: ['-date_created'],
        })
    );
}

export const getStaticProps = async () => {
    const posts = await getPosts();
    return {
        props: {
            'title': "Blog",
            posts,
        },
    };
};

export default function BlogPage({ posts }) {
    return (
        <>
            <ul>
                {posts.map((post) => {
                    return (
                        <li key={post.slug}>
                            <h3>
                                <Link href={`/blog/${post.slug}`}>
                                    {getDisplayTitle(post)}
                                </Link>
                            </h3>
                            <span>
                                {post.date_created} &bull; {post.author.name}
                            </span>
                        </li>
                    );
                })}

            </ul>
        </>
    );
}