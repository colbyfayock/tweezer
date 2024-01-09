import { createHashFromString } from '@/lib/util';
import { sanitizeResource } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser:{
      sizeLimit: '25mb'
    }
  },
  runtime: 'edge'
}


export default async function handler(req) {
  const data = await req.formData();
  const file = data.get('file');
  const timestamp = Date.now();

  const formData = new FormData();

  const parameters = {
    auto_tagging: 0.6,
    categorization: 'google_tagging',
    detection: 'coco',
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADS_FOLDER,
  }

  Object.keys(parameters).sort().forEach(key => {
    formData.append(key, parameters[key]);
  });

  const paramsString = Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join('&');

  const paramsHash = await createHashFromString(`${paramsString}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`);

  formData.append('file', file);
  formData.append('api_key', process.env.CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', paramsHash);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    if ( response.error ) {
      throw new Error(response.error?.message);
    }

    return new Response(JSON.stringify(sanitizeResource(response)), {
      status: 200
    })
  } catch(e) {
    console.log('e', e)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    })
  }
}

