import React from 'react';
import Head from 'next/head'

export const getStaticProps = async () => {
    return {
        props: {
            title: "404 - Page Not Found"
        },
    };
};

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 @ Than</title>
            </Head>
            <div>
                <p>The page you're looking for doesn't exist.</p>
            </div>
        </>

    );
};