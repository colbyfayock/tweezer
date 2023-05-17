import Head from 'next/head'

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Camera from '@/components/Camera';

import styles from '@/styles/Capture.module.scss'

export default function Home() {
  return (
    <Layout navigation={false}>
      <Head>
        <title>Upload - Tweezer</title>
        <meta name="description" content="Tweezer" />
      </Head>

      <Section className={styles.cameraSection}>
        <Container className={styles.cameraContainer}>
          <Camera />
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionHeader}><span>Take or Select a Photo</span></h2>
          <p>Your image will be cropped to a square.</p>
        </Container>
      </Section>
    </Layout>
  )
}