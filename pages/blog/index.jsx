import { request } from '@/lib/cms';
import { getDisplayTitle } from '@/lib/props';
import { formatDate } from '@/lib/formatting';
import Link from 'next/link';

//* See https://directus.io/docs/tutorials/getting-started/fetch-data-from-directus-with-nextjs
export const getStaticProps = async () => {
    const posts = await request('posts', {
        fields: ['slug', 'title', 'date_published', 'status', { author: ['name'] }],
        sort: ['-date_published'],
    });

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
                        <li className='page__blog-entry' key={post.slug}>
                            <div>
                                <Link href={`/blog/${post.slug}`}>
                                    {getDisplayTitle(post)}
                                </Link>
                            </div>
                            <span>
                                {formatDate(post.date_published)}
                                {/* {post.date_created} &bull; {post.author.name} */}
                            </span>
                        </li>
                    );
                })}

            </ul>
        </>
    );
}