import { getPage, request } from '@/lib/cms';
import { getDisplayTitle } from '@/lib/props';
import Link from 'next/link';

export async function getStaticProps() {
    const page = await getPage('games');

    if (!page) {
        return { notFound: true };
    }

    const items = await request('item', {
        fields: ['link', 'title', 'date_published', 'status', 'thumbnail', { project_type: ['name'] }, { team: ['name'] }],
        sort: ['-date_published'],
        filter: { 'project_type': { '_eq': 1 } },
    });

    return {
        props: {
            page,
            items
        },
    };
}

function renderItem(item) {
    const itemContents = <>
        {item.thumbnail && <img src={item.thumbnail}></img>}
        {getDisplayTitle(item)}
    </>

    if (item.link)
        return (
            <Link href={item.link} target="_blank">
                {itemContents}
            </Link>);
    else
        return ({ itemContents });
}

export default function Page({ page, items }) {
    return (
        <>
            <div className='page__games-content' dangerouslySetInnerHTML={{ __html: page.content }}></div>

            <ul className='page__games-container'>
                {items.map((item) => {
                    return (
                        <li className='page__games-entry' key={item.link}>
                            <div>
                                {renderItem(item)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}