import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import { createParser } from 'eventsource-parser';

import { CAMERA_HEIGHT, CAMERA_WIDTH } from '@/data/media';

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Button from '@/components/Button';


import styles from '@/styles/Compose.module.scss'


export default function Compose() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(false);
  
  const imgSrc = `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADS_FOLDER}/${router.query.id}`;

  useEffect(() => {
    if ( !router.query.id || !router.query.tags ) return;

    const tags = router.query.tags.split(',');

    const controller = new AbortController();
    const { signal } = controller;

    (async function run() {
      
      setIsLoading(true);

      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          tags
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        signal
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      function onParse(event) {
        if (event.type === 'event') {
          try {
            const data = JSON.parse(event.data);
            data.choices
              .filter(({ delta }) => !!delta.content)
              .forEach(({ delta }) => {
                setMessage(prev => {
                  return `${prev || ''}${delta.content}`;
                })
              });
          } catch(e) {
            console.log(e)
          }
        }
      }
  
      const parser = createParser(onParse)
  
      while (true) {
        const { value, done } = await reader.read();
        const dataString = decoder.decode(value);
        if ( done || dataString.includes('[DONE]') ) break;
        parser.feed(dataString);
      }
  
      setIsLoading(false);

      return () => {
        controller.abort();
        setMessage(undefined);
      }
    })();
  }, [router.query.id, router.query.tags])

  return (
    <Layout navigation={false}>
      <Head>
        <title>Compose - Tweezer</title>
        <meta name="description" content="Tweezer" />
      </Head>

      <Section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <CldImage
            src={imgSrc}
            width={CAMERA_HEIGHT}
            height={CAMERA_WIDTH}
            crop="fill"
            gravity="auto"
            alt=""
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="text-center">{ message }</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionHeader}><span>Compose</span></h2>
          <p className="text-center">Automatically generate your message based on what&apos;s in the photo with AI.</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionHeader}><span>Or Want a New Look?</span></h2>
          <p className="text-center">
            <Button href="/capture">Try a New Photo</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}