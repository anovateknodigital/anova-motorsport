import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json', {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch provinces: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying provinces:', error);
    return NextResponse.json({ error: 'Failed to fetch provinces' }, { status: 500 });
  }
}
