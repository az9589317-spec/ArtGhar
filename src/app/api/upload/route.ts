
import { NextResponse } from 'next/server';

const apiKey = process.env.FREEIMAGE_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: 'Image hosting API key is not configured.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const source = formData.get('source');

    if (!source) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }
    
    const externalApiFormData = new FormData();
    externalApiFormData.append('source', source);
    externalApiFormData.append('key', apiKey);
    
    const externalApiResponse = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: externalApiFormData,
    });

    const result = await externalApiResponse.json();
    
    if (result.status_code !== 200 || !result.image?.url) {
        console.error('freeimage.host API error:', result);
        return NextResponse.json({ error: result.error?.message || 'Failed to upload image to hosting service.' }, { status: externalApiResponse.status });
    }

    const imageUrl = result.image.url;

    return NextResponse.json({ imageUrl: imageUrl });

  } catch (error: any) {
    console.error('Error in upload API route:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
