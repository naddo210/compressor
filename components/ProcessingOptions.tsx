'use client';

import React from 'react';

interface ProcessingOptionsProps {
  fileType: 'image' | 'video' | 'audio';
  options: any;
  onChange: (options: any) => void;
}

export default function ProcessingOptions({ fileType, options, onChange }: ProcessingOptionsProps) {
  const handleChange = (section: string, key: string, value: any) => {
    onChange({
      ...options,
      [section]: {
        ...options[section],
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Processing Options</h3>
      
      {fileType === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
            <input
              type="range"
              min="1"
              max="100"
              value={options.image?.quality || 80}
              onChange={(e) => handleChange('image', 'quality', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>{options.image?.quality || 80}%</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="upscale"
              checked={options.image?.upscale || false}
              onChange={(e) => handleChange('image', 'upscale', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="upscale" className="text-sm text-gray-700">Upscale (2x)</label>
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={options.image?.format || 'jpeg'}
              onChange={(e) => handleChange('image', 'format', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
            </select>
          </div>
        </div>
      )}

      {fileType === 'video' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
            <select
              value={options.video?.resolution || '1080p'}
              onChange={(e) => handleChange('video', 'resolution', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Codec</label>
             <select
               value={options.video?.codec || 'libx264'}
               onChange={(e) => handleChange('video', 'codec', e.target.value)}
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             >
               <option value="libx264">H.264 (Standard)</option>
               <option value="libx265">H.265 (High Efficiency)</option>
             </select>
           </div>
        </div>
      )}

      {fileType === 'audio' && (
        <div className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitrate</label>
            <select
              value={options.audio?.bitrate || '192k'}
              onChange={(e) => handleChange('audio', 'bitrate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="320k">320k (High)</option>
              <option value="192k">192k (Balanced)</option>
              <option value="128k">128k (Standard)</option>
              <option value="64k">64k (Low)</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="normalize"
              checked={options.audio?.normalize || false}
              onChange={(e) => handleChange('audio', 'normalize', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="normalize" className="text-sm text-gray-700">Normalize Loudness</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="denoise"
              checked={options.audio?.denoise || false}
              onChange={(e) => handleChange('audio', 'denoise', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="denoise" className="text-sm text-gray-700">Reduce Background Noise</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enhanceSpeech"
              checked={options.audio?.enhanceSpeech || false}
              onChange={(e) => handleChange('audio', 'enhanceSpeech', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enhanceSpeech" className="text-sm text-gray-700">Enhance Speech (Isolate Voice)</label>
          </div>
        </div>
      )}
    </div>
  );
}
