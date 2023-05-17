import Head from 'next/head';
import { Inter } from 'next/font/google';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import styles from './Layout.module.scss';

const inter = Inter({
  weight: ['400', '600', '800', '900'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-inter',
});

const Layout = ({ children, navigation = true }) => {
  return (
    <div className={`${inter.variable} ${styles.layout}`} data-navigation={navigation}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {navigation && (<Header />)}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
