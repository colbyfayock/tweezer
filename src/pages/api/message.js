export const config = {
  runtime: 'edge'
}

export default async function handler(req, context) {
  const { tags } = await req.json();

  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `
            You are a Tweet generator.

            Given a set of keywords that identify objects or qualities of a photo, you create fun, uplifting, exciting Tweets messages that someone can share with the photo.

            The keywords are: ${tags}

            Generate 1 short sentence Tweet with a maximum of 200 characters.

            The voice of the Tweet should be young and energetic.
            
            The Tweet should be in the first person talking about their experience.

            The response should include nothing else other than the Tweet.

            Only alphanumeric characters, emojis, and hashtags.
          `
        }
      ],
      stream: true,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Organization': process.env.OPENAI_ORGANIZATION
    }
  });

  return new Response(completion.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}