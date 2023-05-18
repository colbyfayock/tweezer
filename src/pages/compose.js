import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { CldImage, getCldImageUrl } from 'next-cloudinary';
import { createParser } from 'eventsource-parser';
import { FaCopy, FaExternalLinkSquareAlt } from 'react-icons/fa';

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
  const imgUrl = getCldImageUrl({
    src: imgSrc,
    format: 'jpg'
  });

  const tags = router.query.tags?.split(',');
  const people = parseInt(router.query.people)

  useEffect(() => {
    if ( !imgSrc || !tags ) return;

    const controller = new AbortController();
    const { signal } = controller;
    let parser;

    (async function run() {
      
      setIsLoading(true);
      setMessage(undefined);

      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          tags,
          people
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
  
      parser = createParser(onParse)
  
      while (true) {
        const { value, done } = await reader.read();
        const dataString = decoder.decode(value);
        if ( done || dataString.includes('[DONE]') ) break;
        parser.feed(dataString);
      }
  
      setIsLoading(false);

      return () => {
        controller.abort();
        parser.reset();
        setMessage(undefined);
      }
    })();
  }, [router.query.id, router.query.tags, router.query.people])

  /**
   * handleOnCopy
   */

  async function handleOnCopy() {
    try {
      window.navigator.clipboard.writeText(message);
    } catch(e) {
      console.log('e', e)
    }
  }

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

      <Section className={styles.messageSection}>
        <Container className={styles.messageContainer}>
          {message && (
            <p className="text-center">
              { message }
            </p>
          )}
          {!message && (
            <p className={`text-center ${styles.messageLoading}`}>
              Working on something special...
            </p>
          )}
          {message && !isLoading && (
            <p className={`text-center ${styles.messageCopy}`}>
              <button onClick={handleOnCopy}>
                <span><FaCopy /></span>
                Copy Message
              </button>
              <a href={imgUrl} download="TweezerImage.jpg" target="_blank">
                <span><FaExternalLinkSquareAlt /></span>
                Open Photo
              </a>
            </p>
          )}
          
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionHeader}><span>Tags</span></h2>
          <p className="text-center">
            These are the tags found by that were used to generate your tweet.
          </p>
          <ul className={styles.tagsTags}>
            {tags?.map(tag => {
              return (
                <li key={tag}>{ tag }</li>
              )
            })}
          </ul>
          <p className="text-center">
            <a href="https://cloudinary.com/documentation/google_auto_tagging_addon">Learn More</a>
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionHeader}><span>Want a New Look?</span></h2>
          <p className="text-center">
            <Button href="/capture">Try a New Photo</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}