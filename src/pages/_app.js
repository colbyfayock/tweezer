import Head from 'next/head';

import { CameraProvider } from '@/hooks/useCamera';

import '@/styles/globals.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>The Hundred</title>
        <meta name="description" content="Your antidote to information overload." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#d90429" />
        <meta name="theme-color" content="#d90429" />
      </Head>
      <CameraProvider>
        <Component {...pageProps} />
      </CameraProvider>
    </>
  );
}
