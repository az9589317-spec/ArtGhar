
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.FREEIMAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Image hosting API key is not configured.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const source = formData.get('source');

    if (!source) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }
    
    // The source can be a File or a string. We need to handle the File case.
    // Create a new FormData to send to the external API
    const externalApiFormData = new FormData();
    externalApiFormData.append('source', source);

    const externalApiResponse = await fetch(`https://freeimage.host/api/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: externalApiFormData,
    });

    const result = await externalApiResponse.json();

    if (!externalApiResponse.ok || result.status_code !== 200) {
        console.error('freeimage.host API error:', result);
        return NextResponse.json({ error: result.error?.message || 'Failed to upload image to hosting service.' }, { status: externalApiResponse.status });
    }

    return NextResponse.json({ imageUrl: result.image.url });

  } catch (error: any) {
    console.error('Error in upload API route:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
