import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Webcam from 'react-webcam';
import { IoMdPhotos } from 'react-icons/io'
import { BiRefresh } from 'react-icons/bi'
import { FaTimes, FaMagic } from 'react-icons/fa'

import { useCamera } from '@/hooks/useCamera';

import { CAMERA_WIDTH, CAMERA_HEIGHT } from '@/data/media'

import styles from './Camera.module.scss';

const videoConstraints = {
  width: {
    min: CAMERA_WIDTH,
  },
  height: {
    min: CAMERA_HEIGHT,
  },
  aspectRatio: CAMERA_WIDTH / CAMERA_HEIGHT,
};

const DEFAULT_IMG_STATE = {
  loading: false,
  loaded: false,
  error: false,
};

const Camera = ({ className, onSrcChange }) => {
  const imgRef = useRef();
  const filepickerRef = useRef();
  const [imgState, setImgState] = useState(DEFAULT_IMG_STATE);
  const [selectedSrc, setSelectedSrc] = useState();
  const [upload, setUpload] = useState();
  const router = useRouter();

  const { ref, image, state, error, facingMode, capture, reset, switchCamera, onUserMedia, onUserMediaError } = useCamera();

  const src = selectedSrc || image;

  const cameraClassName = [styles.camera, className].filter((c) => !!c).join(' ');

  // Construct props to use as data attributes that allow the ability to target different
  // loading states with styling

  const imgStateProps = {};

  Object.keys(imgState).forEach((stateKey) => {
    imgStateProps[`data-img-${stateKey}`] = imgState[stateKey];
  });

  useEffect(() => {
    // On route change, reset everything to make sure when someone
    // navigates back that its a new camera state
    // Not sure of a better way to handle this
    setImgState(DEFAULT_IMG_STATE);
    setSelectedSrc(undefined);
    setUpload(undefined);
    reset();
  }, [router.asPath])

  useEffect(() => {
    if (!imgRef.current) {
      setImgState(DEFAULT_IMG_STATE);
      return;
    }

    setImgState({
      loading: true,
      loaded: false,
      error: false,
    });
  }, []);

  useEffect(() => {
    if ( typeof onSrcChange === 'function' ) {
      onSrcChange(src);
    }
  }, [src])

  useEffect(() => {
    if ( !upload ) return;
    
    const params = {
      id: upload.public_id.replace(`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADS_FOLDER}/`, ''),
      tags: upload.tags.join(',')
    }

    const people = upload.info.detection?.object_detection.data.coco.tags.person;

    if ( people ) {
      params.people = people.length;
    }

    const paramsString = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');

    router.push(`/compose?${paramsString}`);
  }, [upload]);

  function handleOnPick(e) {
    filepickerRef.current.click();
  }

  function handleSelectPhoto(e) {
    setImgState({
      loading: true,
      loaded: false,
      error: false,
    });

    e.preventDefault();

    const reader = new FileReader();

    reader.onload = function(onLoadEvent) {
      setSelectedSrc(onLoadEvent.target.result);

      setImgState({
        loading: false,
        loaded: true,
        error: false,
      });
    }

    reader.readAsDataURL(e.target.files[0]);
  }

  function handleOnReset() {
    setImgState({
      loading: false,
      loaded: false,
      error: false,
    });
    reset();
    setSelectedSrc(undefined);
  }

  async function handleOnUpload() {
    setImgState({
      loading: true,
      loaded: false,
      error: false,
    });

    const formData = new FormData();

    if ( filepickerRef.current.files.length > 0 ) {
      for ( const file of filepickerRef.current.files ) {
        formData.append('file', file);
      }  
    } else if ( image ) {
      formData.append('file', image);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json())

    setUpload(response);
  }

  return (
    <div className={cameraClassName}>
      <div
        className={styles.stageContainer}
        style={{
          aspectRatio: `${CAMERA_WIDTH} / ${CAMERA_HEIGHT}`,
        }}
      >
        <div
          className={styles.stage}
          data-is-active-webcam={state.active}
          data-is-error-webcam={state.error}
          {...imgStateProps}
        >
          {src && <img ref={imgRef} src={src} alt="Webcam Photo" />}
          {!src && !state.error && (
            <Webcam
              ref={ref}
              videoConstraints={{
                ...videoConstraints,
                facingMode
              }}
              width={CAMERA_WIDTH}
              height={CAMERA_HEIGHT}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
            />
          )}
          {state.error && error && (
            <div className={styles.stageError}>
              <p className={styles.stageErrorName}>
                <strong>{error}</strong>
              </p>
              <p className={styles.stageErrorMessage}>
                Uh oh, we&apos;re having trouble loading your camera. Try seeing if your browser is blocking it
                otherwise try another browser.
              </p>
            </div>
          )}
        </div>
      </div>

      <form className="sr-only">
        <input ref={filepickerRef} type="file" onChange={handleSelectPhoto} />
      </form>

      <div className={styles.controls}>
        <ul>
          {!src && (
            <>
              <li className={`${styles.controlsControl} ${styles.controlsPick}`}>
                <button onClick={handleOnPick}>
                  <span className="sr-only">
                    Select a Photo
                  </span>
                  <IoMdPhotos />
                </button>
              </li>
              <li className={`${styles.controlsControl} ${styles.controlsCapture}`}>
                <button onClick={capture}>
                  <span className="sr-only">Capture photo</span>
                </button>
              </li>
              <li className={`${styles.controlsControl} ${styles.controlsPerspective}`}>
                <button onClick={switchCamera}>
                  <span className="sr-only">Change Camera</span>
                  <BiRefresh />
                </button>
              </li>
            </>
          )}
          {src && (
            <>
              <li className={`${styles.controlsControl} ${styles.controlsUpload}`}>
                <button onClick={handleOnUpload}>
                  <span className="sr-only">Magic</span>
                  <FaMagic />
                </button>
              </li>
              <li className={`${styles.controlsControl} ${styles.controlsReset}`}>
                <button onClick={handleOnReset}>
                  <span className="sr-only">Cancel</span>
                  <FaTimes />
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Camera;