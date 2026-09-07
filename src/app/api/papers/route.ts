import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const papers = await db.papers.findMany();
    // exclude textContent to save bandwidth
    const safePapers = papers.map(p => {
      const { textContent, ...rest } = p;
      return rest;
    });
    return NextResponse.json({ success: true, papers: safePapers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}
