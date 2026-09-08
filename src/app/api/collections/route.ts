import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const collections = await db.collections.findMany();
    return NextResponse.json({ success: true, collections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, topic } = await request.json();
    
    if (!name || !topic) {
      return NextResponse.json({ error: 'Name and topic are required' }, { status: 400 });
    }

    const newCollection = await db.collections.create({ name, topic });
    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
