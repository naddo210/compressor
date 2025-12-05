'use client';

import React, { useState, useRef } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileUpload({ onFileSelect, selectedFile, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-3 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out touch-manipulation transform ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 scale-[1.02] shadow-lg'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50 hover:shadow-md active:scale-[0.98]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInput}
            accept="image/*,video/*,audio/*"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Images, Videos, or Audio files
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <button
            onClick={onClear}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatBytes(selectedFile.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
