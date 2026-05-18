import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${id}.json`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch regencies: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying regencies:', error);
    return NextResponse.json({ error: 'Failed to fetch regencies' }, { status: 500 });
  }
}
