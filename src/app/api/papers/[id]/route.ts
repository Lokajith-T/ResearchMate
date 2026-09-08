import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const paperId = params.id;
    
    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }

    await db.papers.delete(paperId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const paperId = params.id;
    const updates = await request.json();
    
    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }

    const updatedPaper = await db.papers.update(paperId, updates);
    return NextResponse.json({ success: true, paper: updatedPaper });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update paper' }, { status: 500 });
  }
}
