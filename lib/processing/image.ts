import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface ImageProcessingOptions {
  quality?: number; // 1-100
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  upscale?: boolean; // Placeholder for AI upscaling
  denoise?: boolean; // Placeholder for AI denoising
}

export async function processImage(
  inputPath: string,
  outputPath: string,
  options: ImageProcessingOptions
): Promise<void> {
  let pipeline = sharp(inputPath);

  // Resize if dimensions provided
  if (options.width || options.height) {
    pipeline = pipeline.resize({
      width: options.width,
      height: options.height,
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: !options.upscale, // Don't upscale unless requested (though sharp upscaling is basic)
    });
  }

  // Format conversion and compression
  const quality = options.quality || 80;
  
  // If AI enhancement is requested, we would call an external script here
  // For now, we'll stick to standard sharp operations
  
  if (options.format) {
    pipeline = pipeline.toFormat(options.format, { quality });
  } else {
    // Keep original format but compress
    // Sharp detects input format automatically, but toFormat is explicit.
    // We might need to detect input format if we want to keep it.
    // simpler to just default to webp or jpeg if not specified, or infer from extension.
    // For now, let's assume the caller specifies the format or we default to the input's format (if possible, but sharp requires explicit toFormat for options usually)
    // Actually, sharp can infer.
  }

  // Apply basic sharpening if upscaling was requested (basic heuristic)
  if (options.upscale) {
    pipeline = pipeline.sharpen();
  }

  await pipeline.toFile(outputPath);
}

export async function getImageMetadata(filePath: string) {
  return await sharp(filePath).metadata();
}
