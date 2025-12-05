import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { processImage } from '@/lib/processing/image';
import { processVideo } from '@/lib/processing/video';
import { processAudio } from '@/lib/processing/audio';
import { v4 as uuidv4 } from 'uuid';

import os from 'os';

// Use temporary directory for Vercel compatibility
const TEMP_DIR = os.tmpdir();
const UPLOAD_DIR = path.join(TEMP_DIR, 'compressor-uploads');
const PROCESSED_DIR = path.join(TEMP_DIR, 'compressor-processed');

async function ensureDirs() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
    await ensureDirs();

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const optionsJson = formData.get('options') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const options = optionsJson ? JSON.parse(optionsJson) : {};
        const fileType = options.fileType || 'image';

        // Save uploaded file
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileId = crypto.randomUUID();
        const originalExt = path.extname(file.name);
        const inputFilename = `${fileId}${originalExt}`;
        const inputPath = path.join(UPLOAD_DIR, inputFilename);

        await fs.writeFile(inputPath, buffer);

        // Determine output path
        // Determine output extension
        let outputExt = originalExt;
        if (fileType === 'image' && options.image?.format) {
            outputExt = `.${options.image.format}`;
        } else if (fileType === 'audio' && options.audio?.format) {
            // Map common formats if needed, but usually it's just the name
            outputExt = `.${options.audio.format}`;
        }

        const outputFilename = `${fileId}_processed${outputExt}`;
        const outputPath = path.join(PROCESSED_DIR, outputFilename);

        // Process based on type
        let processingTime = 0;
        const startTime = Date.now();

        if (fileType === 'image') {
            await processImage(inputPath, outputPath, options.image || {});
        } else if (fileType === 'video') {
            await processVideo(inputPath, outputPath, options.video || {});
        } else if (fileType === 'audio') {
            await processAudio(inputPath, outputPath, options.audio || {});
        } else {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        processingTime = Date.now() - startTime;

        // Get metadata
        const originalStats = await fs.stat(inputPath);
        const processedStats = await fs.stat(outputPath);

        return NextResponse.json({
            status: 'success',
            compressed_file_url: `/api/serve?file=${outputFilename}`,
            metadata: {
                original_size: originalStats.size,
                compressed_size: processedStats.size,
                processing_time: `${processingTime}ms`,
            },
        });

    } catch (error: unknown) {
        console.error('Processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Processing failed';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
