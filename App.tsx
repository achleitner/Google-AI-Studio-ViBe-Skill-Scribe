
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ProblemInput } from './components/ProblemInput';
import { SolutionOutput } from './components/SolutionOutput';
import { solveProblem } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { Solution } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError("Please provide both an image and a description of your problem.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await solveProblem(prompt, base64, mimeType);
      setSolution(result);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get a solution. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);
  
  const examplePrompt = "I need to get the total sales for 'North', 'South', and 'East' from this data every week. How can I do this faster?";

  const handleExample = () => {
    setPrompt(examplePrompt);
    // Note: User still needs to upload a relevant image for the example to work.
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProblemInput
            imageFile={imageFile}
            setImageFile={setImageFile}
            prompt={prompt}
            setPrompt={setPrompt}
            onSolve={handleSolve}
            isLoading={isLoading}
            onUseExample={handleExample}
          />
          <SolutionOutput
            solution={solution}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
