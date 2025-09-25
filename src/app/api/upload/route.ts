
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const source = formData.get('source');

    if (!source) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }
    
    // Create a new FormData to send to the external API
    const externalApiFormData = new FormData();
    externalApiFormData.append('file', source);

    // Use iili.io for image hosting
    const externalApiResponse = await fetch('https://iili.io/v2/upload', {
      method: 'POST',
      body: externalApiFormData,
    });

    const result = await externalApiResponse.json();

    if (!externalApiResponse.ok || !result.files?.[0]?.url) {
        console.error('iili.io API error:', result);
        return NextResponse.json({ error: result.message || 'Failed to upload image to hosting service.' }, { status: externalApiResponse.status });
    }

    // The direct URL to the image
    const imageUrl = result.files[0].url;

    return NextResponse.json({ imageUrl: imageUrl });

  } catch (error: any) {
    console.error('Error in upload API route:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
