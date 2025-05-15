import React from 'react';
import { getDisplayTitle } from '@/lib/props';
import Link from 'next/link';

const PageLayout = ({ page, items }) => {
    return (
        <>
            <div className='page__items-content' dangerouslySetInnerHTML={{ __html: page.content }}></div>

            <ul className='page__items-container'>
                {items.map((item) => {
                    return (
                        <li className='page__items-entry' key={item.link}>
                            <Item item={item} />
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

function Item({ item }) {
    let itemContents = <>
        {item.thumbnail && <img src={item.thumbnail}></img>}
        {getDisplayTitle(item)}
    </>

    if (item.link) {
        itemContents =
            <Link href={item.link} target="_blank">
                {itemContents}
            </Link>;
    }

    return (itemContents);
}

export default PageLayout;