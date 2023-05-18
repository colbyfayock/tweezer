import { useState } from 'react';
import Head from 'next/head'

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Camera from '@/components/Camera';

import styles from '@/styles/Capture.module.scss'

export default function Capture() {
  const [src, setSrc] = useState();

  function handleOnSrcChange(updatedSrc) {
    setSrc(updatedSrc);
  }

  return (
    <Layout navigation={false}>
      <Head>
        <title>Capture - Tweezer</title>
      </Head>

      <Section className={styles.cameraSection}>
        <Container className={styles.cameraContainer}>
          <Camera onSrcChange={handleOnSrcChange} />
        </Container>
      </Section>

      {!src && (
        <Section>
          <Container>
            <h2 className={styles.sectionHeader}><span>Take or Select a Photo</span></h2>
            <p>Your image will be cropped to a square.</p>
          </Container>
        </Section>
      )}

      {src && (
        <Section>
          <Container>
            <h2 className={styles.sectionHeader}><span>Looking good?</span></h2>
            <p>Hit the magic to get your moment.</p>
          </Container>
        </Section>
      )}
    </Layout>
  )
}