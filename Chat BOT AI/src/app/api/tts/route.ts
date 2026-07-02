import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voice = '茉莉' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.MIMO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'MIMO_API_KEY is not configured in .env.local' }, { status: 500 });
    }

    const payload = {
      model: 'mimo/mimo-v2.5-tts',
      messages: [
        { role: 'user', content: 'Gunakan nada suara yang ramah, sopan, dan Islami. (senyum)' },
        { role: 'assistant', content: text }
      ],
      audio: {
        format: 'wav',
        voice: voice
      }
    };

    const response = await fetch('https://api-ai.hbyspirates.my.id/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiMo API Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate audio from MiMo API' }, { status: response.status });
    }

    const data = await response.json();
    const audioBase64 = data.choices?.[0]?.message?.audio?.data;

    if (!audioBase64) {
      return NextResponse.json({ error: 'No audio data received from MiMo API' }, { status: 500 });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
