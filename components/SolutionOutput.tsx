
import React, { useState } from 'react';
import type { Solution } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface SolutionOutputProps {
  solution: Solution | null;
  isLoading: boolean;
  error: string | null;
}

const CodeSnippet: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                    {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto text-slate-200">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse-fast">
        <div className="space-y-3">
            <div className="h-6 bg-slate-700 rounded-md w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded-md w-full"></div>
            <div className="h-4 bg-slate-700 rounded-md w-5/6"></div>
        </div>
        <div className="space-y-3">
            <div className="h-6 bg-slate-700 rounded-md w-1/4"></div>
            <div className="h-32 bg-slate-700 rounded-xl w-full"></div>
        </div>
        <div className="space-y-3">
            <div className="h-6 bg-slate-700 rounded-md w-1/2"></div>
            <div className="h-16 bg-slate-700 rounded-xl w-full"></div>
            <div className="h-16 bg-slate-700 rounded-xl w-full"></div>
            <div className="h-16 bg-slate-700 rounded-xl w-full"></div>
        </div>
    </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <SparklesIcon className="w-16 h-16 text-cyan-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to SkillScribe</h2>
        <p className="text-slate-400 max-w-md">
            Upload a photo of a technical problem you're stuck on, describe your goal, and get an instant explanation, solution, and micro-lesson.
        </p>
    </div>
)


export const SolutionOutput: React.FC<SolutionOutputProps> = ({ solution, isLoading, error }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 min-h-[500px] lg:min-h-full">
      {isLoading && <LoadingSkeleton />}
      {error && !isLoading && (
        <div className="flex items-center justify-center h-full text-center">
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Oops! Something went wrong.</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && !solution && <WelcomeMessage />}
      {solution && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Problem Explained</h2>
            <p className="text-slate-300 leading-relaxed">{solution.explanation}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2"><CodeIcon className="w-5 h-5"/> Your Solution</h2>
            <CodeSnippet language={solution.solution.language} code={solution.solution.code} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-3">Your Personalized Micro-Lesson</h2>
            <div className="space-y-4">
              {solution.microLesson.map((step) => (
                <div key={step.step} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-white"><span className="text-cyan-400">{step.step}.</span> {step.title}</h3>
                  <p className="text-slate-300 mt-1 text-sm">{step.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
