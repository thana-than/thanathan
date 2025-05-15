import Decorations from '@/components/Decorations';
import Layout from '@/components/Layout';
import '@/css/styles.css'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Decorations />
            <Layout pageProps={pageProps}>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}