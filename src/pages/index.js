import Head from 'next/head'
import { CldImage } from 'next-cloudinary';

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Button from '@/components/Button';

import styles from '@/styles/Home.module.scss'

export default function Home() {
  return (
    <Layout navigation={false}>
      <Section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <CldImage
            className={styles.heroImage}
            width={5000}
            height={3337}
            src="tweezer-assets/celebration_a73ox3"
            alt="Celebration"
            sizes="100vw"
          />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Tweezer</h1>
            <p className={styles.heroTagline}>Post Generator for the Masses</p>
            <p className={styles.heroButton}>
              <Button href="/capture">Share Your Moment</Button>
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className={styles.exampleContainer}>
          <h2 className={styles.sectionHeader}><span>Upload &amp; Share</span></h2>
          <div className={styles.example}>
            <p className={styles.exampleImage}>
              <CldImage
                width="5184"
                height="3456"
                src="tweezer-assets/concert_cnszw7"
                alt="Concert https://unsplash.com/photos/8ALMAJP0Ago"
                sizes="100vw"
              />
            </p>
            <div className={styles.exampleContent}>
              <ul className={styles.exampleTags}>
                <li>music</li>
                <li>crowd</li>
                <li>concert</li>
                <li>stage</li>
                <li>guitarist</li>
                <li>night</li>
              </ul>
              <p className={styles.exampleText}>
                The energy was electric, the stage was on fire, and the crowd was absolutely hyped!
              </p>
            </div>
          </div>
          <p className="text-center">Automatically generate your message based on what&apos;s in the photo with AI.</p>
        </Container>
      </Section>

    </Layout>
  )
}