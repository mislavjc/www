'use client';

import { useState } from 'react';
import Link from 'next/link';

import { projects } from 'lib/data';

const TerminalContent = () => (
  <div className="flex h-full flex-col bg-[#1e1e1e] font-mono text-sm">
    {/* Terminal header */}
    <div className="flex items-center gap-2 border-b border-stone-700 bg-[#323232] px-4 py-2">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <div className="h-3 w-3 rounded-full bg-[#27ca40]" />
      </div>
      <span className="ml-2 text-xs text-stone-400">zsh</span>
    </div>

    {/* Terminal content */}
    <div className="flex-1 space-y-2 p-4 text-stone-300">
      <div>
        <span className="text-green-400">~</span>
        <span className="text-stone-500"> $ </span>
        <span>npx constellator</span>
      </div>
      <div className="text-stone-400">
        <div className="mb-2">
          <span className="text-yellow-400">⭐</span> Fetching your GitHub
          stars...
        </div>
        <div className="mb-2">
          <span className="text-blue-400">📦</span> Found 247 starred repos
        </div>
        <div className="mb-2">
          <span className="text-purple-400">🤖</span> Categorizing with AI...
        </div>
        <div className="mb-2">
          <span className="text-green-400">✓</span> Generated awesome-list.md
        </div>
      </div>
      <div className="mt-4">
        <span className="text-green-400">~</span>
        <span className="text-stone-500"> $ </span>
        <span className="animate-pulse">▌</span>
      </div>
    </div>
  </div>
);

export const BrowserWindow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeProject = projects[activeTab];

  return (
    <div className="w-full overflow-hidden rounded-lg border border-stone-300/50 bg-[#dee1e6] shadow-xl">
      {/* Tab bar */}
      <div className="relative">
        <div className="flex items-end gap-0.5 overflow-x-auto bg-[#dee1e6] px-2 pt-2 hide-scrollbar">
          {projects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-2 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-400 sm:px-4 ${
                activeTab === index
                  ? 'bg-white text-stone-700'
                  : 'text-stone-500 hover:bg-stone-200/50'
              }`}
            >
              <span className="text-sm">{project.favicon}</span>
              <span className="hidden max-w-[100px] truncate sm:inline">
                {project.name}
              </span>
              <span
                className={`ml-1 hidden rounded-full p-0.5 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-600 sm:inline ${
                  activeTab === index
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </span>
            </button>
          ))}
          {/* New tab button */}
          <div className="mb-2 ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded text-stone-400 transition-colors hover:bg-stone-300/50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              />
            </svg>
          </div>
        </div>
        {/* Scroll indicator gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#dee1e6] to-transparent" />
      </div>

      {/* URL bar area */}
      <div className="flex h-10 items-center gap-2 bg-white px-2 sm:gap-3 sm:px-3">
        {/* Navigation buttons - hidden on mobile */}
        <div className="hidden items-center gap-1 text-stone-400 sm:flex">
          <button
            type="button"
            aria-label="Go back"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Go forward"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Refresh"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </svg>
          </button>
        </div>

        {/* URL bar */}
        <div className="flex flex-1 items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 text-sm">
          <svg
            className="h-4 w-4 shrink-0 text-stone-400"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />
          </svg>
          <span className="truncate text-stone-600">
            {activeProject.url.replace('https://', '')}
          </span>
        </div>

        {/* Right side icons - hidden on mobile */}
        <div className="hidden items-center gap-1 text-stone-400 sm:flex">
          <button
            type="button"
            aria-label="More options"
            className="rounded-full p-1.5 transition-colors hover:bg-stone-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content - iframe for web, terminal for CLI */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
        {activeProject.type === 'cli' ? (
          <TerminalContent />
        ) : (
          <iframe
            key={activeProject.url}
            src={activeProject.url}
            title={activeProject.name}
            className="h-[200%] w-[200%] origin-top-left scale-50 border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        {/* Overlay with info on hover */}
        <Link
          href={activeProject.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/0 opacity-0 transition-all hover:bg-stone-900/80 hover:opacity-100"
        >
          <span className="mb-2 text-lg font-medium text-white">
            {activeProject.name}
          </span>
          <span className="max-w-xs text-center text-sm text-stone-300">
            {activeProject.description}
          </span>
          <span className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-stone-900">
            {activeProject.type === 'cli' ? 'View on GitHub' : 'Visit site'}{' '}
            <span>↗</span>
          </span>
        </Link>
      </div>
    </div>
  );
};
