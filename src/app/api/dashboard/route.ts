import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const papers = await db.papers.findMany();
    const collections = await db.collections.findMany();
    const gaps = await db.gaps.findMany();

    // In a real app we might determine topics dynamically, here we mock it based on collections
    return NextResponse.json({
      success: true,
      stats: {
        totalPapers: papers.length,
        totalCollections: collections.length,
        totalGaps: gaps.length,
        totalTopics: new Set(collections.map(c => c.topic)).size || 1
      },
      recentPapers: papers.slice(-3).reverse(), // Last 3 added
      recentGaps: gaps.slice(-2).reverse() // Last 2 added
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
