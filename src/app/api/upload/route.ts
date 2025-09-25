
'use server';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Hardcoding the API key to ensure it is available on the server.
  const apiKey = "6d207e02198a847aa98d0a2a901485a5";

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Image hosting API key is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const requestData = await request.formData();
    const file = requestData.get('source') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('source', file, file.name);

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to upload image.' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
