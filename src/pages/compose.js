import { useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';

import { CAMERA_HEIGHT, CAMERA_WIDTH } from '@/data/media';

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Button from '@/components/Button';


import styles from '@/styles/Compose.module.scss'


export default function Home() {
  const router = useRouter();

  useEffect(() => {
console.log('router.query.id', router.query.id)
  }, [router.query.id])

  return (
    <Layout navigation={false}>
      <Head>
        <title>Compose - Tweezer</title>
        <meta name="description" content="Tweezer" />
      </Head>

      <Section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <CldImage
            src={`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADS_FOLDER}/${router.query.id}`}
            width={CAMERA_HEIGHT}
            height={CAMERA_WIDTH}
            crop="fill"
            gravity="auto"
            alt=""
          />
        </Container>
      </Section>

      <Section>
        <Container className={styles.exampleContainer}>
          <h2 className={styles.sectionHeader}><span>Compose</span></h2>
          <p className="text-center">Automatically generate your message based on what&apos;s in the photo with AI.</p>
        </Container>
      </Section>

      <Section>
        <Container className={styles.exampleContainer}>
          <h2 className={styles.sectionHeader}><span>Or Want a New Look?</span></h2>
          <p className="text-center">
            <Button href="/capture">Try a New Photo</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}