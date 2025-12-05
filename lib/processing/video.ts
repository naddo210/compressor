import ffmpeg from 'fluent-ffmpeg';
import { getFfmpegPath } from '@/lib/ffmpeg';

const ffmpegPath = getFfmpegPath();
if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
} else {
    console.warn('ffmpeg binary not found. Processing may fail.');
}

interface VideoProcessingOptions {
    resolution?: '1080p' | '720p' | '480p';
    crf?: number; // 18-32, lower is better quality
    codec?: 'libx264' | 'libx265';
    preset?: 'fast' | 'medium' | 'slow';
}

export function processVideo(
    inputPath: string,
    outputPath: string,
    options: VideoProcessingOptions
): Promise<void> {
    return new Promise((resolve, reject) => {
        let command = ffmpeg(inputPath);

        // Set codec
        if (options.codec) {
            command = command.videoCodec(options.codec);
        } else {
            command = command.videoCodec('libx264'); // Default
        }

        // Set CRF (Constant Rate Factor)
        if (options.crf) {
            command = command.addOption('-crf', options.crf.toString());
        } else {
            command = command.addOption('-crf', '23'); // Default balanced
        }

        // Set Preset
        if (options.preset) {
            command = command.addOption('-preset', options.preset);
        } else {
            command = command.addOption('-preset', 'medium');
        }

        // Set Resolution
        if (options.resolution) {
            let size = '?x1080';
            if (options.resolution === '720p') size = '?x720';
            if (options.resolution === '480p') size = '?x480';
            command = command.size(size);
        }

        // Audio Codec (AAC is standard)
        command = command.audioCodec('aac').audioBitrate('128k');

        command
            .on('end', () => {
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            })
            .save(outputPath);
    });
}
