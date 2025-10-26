
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 md:px-8 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                SkillScribe
            </h1>
        </div>
        <p className="hidden md:block text-slate-400">Your AI-Powered Personal Mentor</p>
      </div>
    </header>
  );
};
