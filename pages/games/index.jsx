import directus, { getPage } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { getDisplayTitle } from '@/lib/props';
import { formatDate } from '@/lib/formatting';
import Link from 'next/link';

async function getItems() {
    return directus.request(
        readItems('item', {
            fields: ['link', 'title', 'date_published', 'status', { project_type: ['name'] }, { team: ['name'] }],
            sort: ['-date_published'],
            filter: { 'project_type': { '_eq': 1 } }, //* ID 1 is games
        })
    );
}

export async function getStaticProps() {
    const page = await getPage('games');
    const games = await getItems();

    if (!page) {
        return { notFound: true };
    }

    return {
        props: {
            page,
            games
        },
    };
}

function linkTitle(item) {
    if (item.link)
        return (
            <Link href={item.link}>
                {getDisplayTitle(item)}
            </Link>);
    else
        return (<>{getDisplayTitle(item)}</>
        );
}

export default function Page({ page, games }) {
    //TODO thumbnail, better formatting
    return (
        <>
            <div className='page__games-content' dangerouslySetInnerHTML={{ __html: page.content }}></div>

            <ul>
                {games.map((game) => {
                    return (
                        <li className='page__games-entry' key={game.link}>
                            <div>
                                {linkTitle(game)}
                            </div>
                            <span>
                                {formatDate(game.date_published)}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}