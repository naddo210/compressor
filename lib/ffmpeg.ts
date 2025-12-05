import path from 'path';
import os from 'os';
import fs from 'fs';

export function getFfmpegPath(): string | null {
    // Strategy 1: Try the environment variable if set
    if (process.env.FFMPEG_PATH) {
        return process.env.FFMPEG_PATH;
    }

    // Strategy 2: Try the standard ffmpeg-static import
    try {
        const ffmpegStatic = require('ffmpeg-static');
        if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
            return ffmpegStatic;
        }
    } catch (e) {
        // Ignore error
    }

    // Strategy 3: Manual search in common Vercel/Node locations
    const possiblePaths = [
        path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg'),
        path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe'),
        path.join(process.cwd(), '..', 'node_modules', 'ffmpeg-static', 'ffmpeg'),
        path.join(process.cwd(), '..', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe'),
        // Vercel specific paths often found in serverless functions
        path.join(process.cwd(), '.next/server/chunks/node_modules/ffmpeg-static/ffmpeg'),
        path.join(process.cwd(), '../../node_modules/ffmpeg-static/ffmpeg'), // Monorepo style
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }

    return null;
}
