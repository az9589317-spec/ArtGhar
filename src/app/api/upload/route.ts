
import { NextResponse } from 'next/server';

const apiKey = process.env.FREEIMAGE_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: { message: 'Image hosting API key is not configured.'} }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const source = formData.get('source');

    if (!source) {
      return NextResponse.json({ error: { message: 'No image file provided.' } }, { status: 400 });
    }
    
    // freeimage.host expects a FormData object with 'key' and 'source'
    const externalApiFormData = new FormData();
    externalApiFormData.append('key', apiKey);
    externalApiFormData.append('source', source);
    
    const externalApiResponse = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: externalApiFormData,
    });

    const result = await externalApiResponse.json();
    
    if (result.status_code !== 200 || !result.image?.url) {
        console.error('freeimage.host API error:', result);
        return NextResponse.json({ error: { message: result.error?.message || 'Failed to upload image to hosting service.' } }, { status: externalApiResponse.status });
    }

    // IMPORTANT: The client expects the response in the format { image: { url: '...' } }
    // based on the original freeimage.host direct-upload example.
    return NextResponse.json({ image: { url: result.image.url } });

  } catch (error: any) {
    console.error('Error in upload API route:', error);
    return NextResponse.json({ error: { message: 'An internal server error occurred.' } }, { status: 500 });
  }
}
