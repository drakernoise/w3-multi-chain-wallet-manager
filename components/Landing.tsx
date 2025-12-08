import React from 'react';
import { Chain } from '../types';

interface LandingProps {
  onSelectChain: (chain: Chain) => void;
  onManage: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelectChain, onManage }) => {
  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto custom-scrollbar">

      {/* Hero Section */}
      <div className="text-center space-y-2 mt-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Welcome Back
        </h1>
        <p className="text-slate-400 text-sm">Select a network to manage your assets</p>
      </div>

      {/* Chain Selector */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => onSelectChain(Chain.HIVE)}
          className="bg-dark-800 hover:bg-dark-700 border border-dark-700 p-4 rounded-xl flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-hive flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">H</div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-slate-200">Hive Network</h3>
            <p className="text-xs text-slate-500">Social & Apps</p>
          </div>
          <svg className="w-5 h-5 text-slate-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <button
          onClick={() => onSelectChain(Chain.STEEM)}
          className="bg-dark-800 hover:bg-dark-700 border border-dark-700 p-4 rounded-xl flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-steem flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">S</div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-slate-200">Steem Blockchain</h3>
            <p className="text-xs text-slate-500">Content & Communities</p>
          </div>
          <svg className="w-5 h-5 text-slate-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <button
          onClick={() => onSelectChain(Chain.BLURT)}
          className="bg-dark-800 hover:bg-dark-700 border border-dark-700 p-4 rounded-xl flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-blurt flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">B</div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-slate-200">Blurt</h3>
            <p className="text-xs text-slate-500">Freedom of Speech</p>
          </div>
          <svg className="w-5 h-5 text-slate-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={onManage}
          className="bg-dark-800 p-3 rounded-lg border border-dark-700 hover:border-blue-500/50 transition-colors text-center"
        >
          <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <span className="text-xs font-bold text-slate-300">Manage Keys</span>
        </button>
        <a
          href="https://hive.blog"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-800 p-3 rounded-lg border border-dark-700 hover:border-purple-500/50 transition-colors text-center block"
        >
          <div className="w-8 h-8 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
          </div>
          <span className="text-xs font-bold text-slate-300">dApp Browser</span>
        </a>
      </div>
    </div>
  );
};