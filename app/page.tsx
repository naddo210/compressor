'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Download, RefreshCw, ArrowRight, CheckCircle } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ProcessingOptionsForm from '@/components/ProcessingOptions';
import { formatBytes } from '@/lib/utils';
import { ProcessingOptions, ProcessingResult } from '@/lib/types';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB Vercel limit

  const getFileType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // Default
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    
    const fileType = getFileType(file);
    const requestOptions = {
      fileType,
      [fileType]: options[fileType] || {},
    };
    
    formData.append('options', JSON.stringify(requestOptions));

    try {
      const response = await axios.post('/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An error occurred during processing.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setOptions({});
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 sm:text-5xl sm:tracking-tight lg:text-6xl drop-shadow-sm">
            Media<span className="text-gray-900">Compressor</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 font-medium">
            Professional-grade compression and enhancement for your media files. by Nadeem salamni.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {/* Left Column: Upload & Options */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Upload File</h2>
                  <FileUpload
                    selectedFile={file}
                    onFileSelect={setFile}
                    onClear={handleReset}
                  />
                </div>

                {file && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Configure</h2>
                    <ProcessingOptionsForm
                      fileType={getFileType(file)}
                      options={options}
                      onChange={setOptions}
                    />
                    
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className={`mt-6 sm:mt-8 w-full flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border border-transparent text-base font-medium rounded-lg sm:rounded-md text-white ${
                        isProcessing
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 md:text-lg'
                      } transition-colors duration-200 shadow-sm active:scale-95 transform transition-transform`}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Start Processing
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Results or Placeholder */}
              <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center items-center min-h-[400px]">
                {error && (
                  <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {!file && !result && !error && (
                  <div className="text-center text-gray-400">
                    <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                      <UploadIconPlaceholder />
                    </div>
                    <p>Upload a file to see options</p>
                  </div>
                )}

                {file && !result && !error && !isProcessing && (
                  <div className="text-center text-gray-500">
                    <p>Ready to process</p>
                  </div>
                )}
                
                {isProcessing && (
                   <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Optimizing your media...</p>
                   </div>
                )}

                {result && (
                  <div className="w-full space-y-6 animate-in zoom-in duration-300">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Processing Complete!</h3>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {file && getFileType(file) === 'image' && (
                        <img 
                          src={result.compressed_file_url} 
                          alt="Processed" 
                          className="w-full h-auto max-h-[300px] object-contain"
                        />
                      )}
                      {file && getFileType(file) === 'video' && (
                        <video 
                          src={result.compressed_file_url} 
                          controls 
                          className="w-full h-auto max-h-[300px]"
                        />
                      )}
                      {file && getFileType(file) === 'audio' && (
                        <div className="p-4 flex justify-center">
                          <audio 
                            src={result.compressed_file_url} 
                            controls 
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Original Size</span>
                        <span className="font-medium text-gray-900">{formatBytes(result.metadata.original_size)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">New Size</span>
                        <span className="font-medium text-green-600">{formatBytes(result.metadata.compressed_size)}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Reduction</span>
                        <span className="font-bold text-green-600">
                          {Math.round((1 - result.metadata.compressed_size / result.metadata.original_size) * 100)}%
                        </span>
                      </div>
                       <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Time</span>
                        <span>{result.metadata.processing_time}</span>
                      </div>
                    </div>

                    <a
                      href={result.compressed_file_url}
                      download
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <Download className="-ml-1 mr-2 h-4 w-4" />
                      Download Result
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function UploadIconPlaceholder() {
  return (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}
