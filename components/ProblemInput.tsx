
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProblemInputProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSolve: () => void;
  isLoading: boolean;
  onUseExample: () => void;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  imageFile,
  setImageFile,
  prompt,
  setPrompt,
  onSolve,
  isLoading,
  onUseExample,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setImageFile]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-6 h-full shadow-lg border border-slate-700">
      <div className="flex-grow flex flex-col gap-4">
        <label
          htmlFor="file-upload"
          className="relative block w-full h-48 sm:h-64 rounded-xl border-2 border-dashed border-slate-600 hover:border-cyan-400 transition-colors duration-300 cursor-pointer flex justify-center items-center text-center p-4 bg-slate-900/50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Problem preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <UploadIcon className="w-10 h-10" />
              <span className="font-semibold">Upload a photo of your problem</span>
              <span className="text-sm">Drag & drop or click to browse</span>
            </div>
          )}
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </label>
        
        <div className="relative">
          <textarea
            rows={5}
            name="prompt"
            id="prompt"
            className="block w-full rounded-xl border-0 bg-slate-900/50 p-4 text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-all"
            placeholder="Describe what you're stuck on or what you want to achieve..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="absolute bottom-2 right-2">
            <button
              type="button"
              onClick={onUseExample}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Use Example
            </button>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        onClick={onSolve}
        disabled={isLoading || !imageFile || !prompt}
        className="w-full flex items-center justify-center gap-3 rounded-xl bg-cyan-600 px-4 py-3 text-lg font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-6 h-6" />
            <span>Solve My Problem</span>
          </>
        )}
      </button>
    </div>
  );
};
