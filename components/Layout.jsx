import { useRouter } from 'next/router';
import React from 'react'
import { getDisplayTitle, getSubHead, getDisplayDate } from '@/lib/props';
import { Header, Main, Footer, Mask } from './Page.jsx';
import { pageTitle } from '@/lib/formatting.js';
import Head from 'next/head'

export default function Layout({ children, pageProps }) {
    const title = getDisplayTitle(pageProps) || "ThanaThan";
    const displayDate = getDisplayDate(pageProps) || '';
    const router = useRouter();
    const isHome = router.pathname === '/';
    const headTitle = isHome ? "ThanaThan" : pageTitle(title);
    const subHead = getSubHead(pageProps);
    return (
        <>
            <Head>
                <title>{headTitle}</title>
            </Head>
            <div className="page">
                <Header key="static-header" title={title} subHead={subHead} date={displayDate} />
                <Mask>
                    <Main> {children} </Main>
                    <Footer />
                </Mask>
            </div>
        </>

    );
}