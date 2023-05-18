import Head from 'next/head';
import { CldOgImage } from 'next-cloudinary';

import { CameraProvider } from '@/hooks/useCamera';

import '@/styles/globals.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Tweezer - Post Generator for the Masses</title>
        <meta name="description" content="Share your experience with AI-driven social message generation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <CldOgImage src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_FOLDER}/tweezer-social-default_lvecgi`} />
      <CameraProvider>
        <Component {...pageProps} />
      </CameraProvider>
    </>
  );
}
