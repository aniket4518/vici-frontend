import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'termsofservice.md');
    const content = fs.readFileSync(filePath, 'utf8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Terms of service not found', { status: 404 });
  }
}
