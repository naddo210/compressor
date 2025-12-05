import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import os from 'os';

// Resolve ffmpeg path manually to avoid bundling issues
const ffmpegPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', os.platform() === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

interface AudioProcessingOptions {
    format?: 'mp3' | 'aac' | 'opus' | 'wav';
    bitrate?: string; // e.g., '192k'
    normalize?: boolean;
    denoise?: boolean;
    enhanceSpeech?: boolean;
}

export function processAudio(
    inputPath: string,
    outputPath: string,
    options: AudioProcessingOptions
): Promise<void> {
    return new Promise((resolve, reject) => {
        let command = ffmpeg(inputPath);

        // Set bitrate
        if (options.bitrate) {
            command = command.audioBitrate(options.bitrate);
        }

        // Normalization (using dynaudnorm filter)
        if (options.normalize) {
            command = command.audioFilters('dynaudnorm');
        }

        // Noise Reduction (using afftdn filter)
        if (options.denoise) {
            // afftdn: FFT-based noise reduction. nr=10 is noise reduction in dB.
            command = command.audioFilters('afftdn=nr=10:nf=-25:tn=1');
        }

        // Speech Enhancement (Bandpass filter to isolate voice frequencies)
        if (options.enhanceSpeech) {
            // Highpass at 200Hz, Lowpass at 3000Hz (typical voice range)
            // Also adding a slight boost to presence range (1k-3k) could be good, but bandpass is safer for "isolation"
            command = command.audioFilters('highpass=f=200,lowpass=f=3000');
        }

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
