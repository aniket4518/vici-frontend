import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'privacypolicy.md');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Serve as raw HTML
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Privacy policy not found', { status: 404 });
  }
}
