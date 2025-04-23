import React from 'react'
import { getDisplayTitle, getSubHead } from '@/lib/props';
import { Header, Main, Footer } from './Page.jsx';

export default function Layout({ children, pageProps }) {
    const title = getDisplayTitle(pageProps) || "Thanathan";
    const subHead = getSubHead(pageProps);
    return (
        <div className="page">
            <Header title={title} subHead={subHead} />
            <Main> {children} </Main>
            <Footer />
        </div>
    );
}
