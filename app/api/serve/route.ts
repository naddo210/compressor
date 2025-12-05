import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const filename = searchParams.get('file');

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const TEMP_DIR = os.tmpdir();
    const PROCESSED_DIR = path.join(TEMP_DIR, 'compressor-processed');
    const filePath = path.join(PROCESSED_DIR, filename);

    try {
        const fileBuffer = await fs.readFile(filePath);

        // Determine content type
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';
        if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.mp4') contentType = 'video/mp4';
        else if (ext === '.mp3') contentType = 'audio/mpeg';
        else if (ext === '.wav') contentType = 'audio/wav';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
