import directus, { getPage, downloadFiles } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { getDisplayTitle } from '@/lib/props';
import Link from 'next/link';

async function getItems() {
    let items = await directus.request(
        readItems('item', {
            fields: ['link', 'title', 'date_published', 'status', 'thumbnail', { project_type: ['name'] }, { team: ['name'] }],
            sort: ['-date_published'],
            filter: { 'project_type': { '_eq': 1 } }, //* ID 1 is games
        })
    );

    //* Has to be done to ensure our images are actual stored on the static site
    items = await downloadFiles(items, 'thumbnail');

    return items;
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

function linkItem(item) {
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

export default function Page({ page, games }) {
    //TODO thumbnail, better formatting
    return (
        <>
            <div className='page__games-content' dangerouslySetInnerHTML={{ __html: page.content }}></div>

            <ul className='page__games-container'>
                {games.map((game) => {
                    return (
                        <li className='page__games-entry' key={game.link}>
                            <div>
                                {linkItem(game)}
                                {/* <span>
                                {formatDate(game.date_published)}
                                </span> */}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}