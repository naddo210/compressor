export interface ProcessingOptions {
    image?: {
        quality?: number;
        upscale?: boolean;
        format?: string;
    };
    video?: {
        resolution?: string;
        codec?: string;
    };
    audio?: {
        bitrate?: string;
        normalize?: boolean;
    };
    [key: string]: any; // Allow dynamic access for now, or refine
}

export interface ProcessingResult {
    status: string;
    compressed_file_url: string;
    metadata: {
        original_size: number;
        compressed_size: number;
        processing_time: string;
    };
}
