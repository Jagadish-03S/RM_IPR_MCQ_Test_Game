import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface BackgroundScene {
  id: string;
  name: string;
  tagline: string;
  src: string;
  fallbackSrc: string;
}

const SCENES: BackgroundScene[] = [
  {
    id: 'run-chase',
    name: 'Real Dog & Cat Full Speed Chase',
    tagline: 'Real puppy & kitten running and playing tag',
    src: '/media/dog_cat_run.gif',
    fallbackSrc: 'https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif'
  },
  {
    id: 'run-tag-2',
    name: 'Outdoor Sprint & Playful Rush',
    tagline: 'Real energetic duo sprinting and chasing',
    src: '/media/dog_cat_run2.gif',
    fallbackSrc: 'https://media.giphy.com/media/26FPqAH61DhAndwPa/giphy.gif'
  },
  {
    id: 'carpet-wrestle',
    name: 'Living Room Tag & Tumble',
    tagline: 'Real dog and cat wrestling and running across the carpet',
    src: '/media/dog_cat_play2.gif',
    fallbackSrc: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif'
  },
  {
    id: 'sneak-pounce',
    name: 'Sneak Attack & Couch Sprint',
    tagline: 'Real dog and cat playing hide-and-seek sprint',
    src: '/media/dog_cat_play3.gif',
    fallbackSrc: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif'
  }
];

export const PetPlayBackground: React.FC = () => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [opacityMode, setOpacityMode] = useState<'subtle' | 'balanced' | 'vivid'>('balanced');
  const [showControls, setShowControls] = useState(false);
  const [showRunner, setShowRunner] = useState(true);

  // Load user preference if saved
  useEffect(() => {
    const saved = localStorage.getItem('rm_ipr_pet_bg_opacity');
    if (saved === 'subtle' || saved === 'balanced' || saved === 'vivid') {
      setOpacityMode(saved);
    }
  }, []);

  const handleOpacityChange = (mode: 'subtle' | 'balanced' | 'vivid') => {
    setOpacityMode(mode);
    localStorage.setItem('rm_ipr_pet_bg_opacity', mode);
  };

  const nextScene = () => {
    setSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  const currentScene = SCENES[sceneIdx];

  // Opacity styles for background
  const opacityClass =
    opacityMode === 'vivid'
      ? 'opacity-65'
      : opacityMode === 'subtle'
      ? 'opacity-20'
      : 'opacity-40';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Full-screen Real Dog & Cat Running / Playing Footage */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={currentScene.src}
          alt={currentScene.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = currentScene.fallbackSrc;
          }}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${opacityClass} filter contrast-125 saturate-110`}
        />
        {/* Cinematic Vignette & Ambient Gradient Overlays for perfect UI legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-60" />
      </div>

      {/* 2. Real Running Pets Live Horizon Track (Running across the background) */}
      {showRunner && (
        <div className="absolute bottom-10 left-0 right-0 h-28 pointer-events-none overflow-hidden opacity-80">
          <div className="pet-runner-track flex items-center space-x-6">
            {/* Real running duo frame */}
            <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/40 shadow-xl shadow-amber-950/40">
              <img
                src="/media/dog_cat_run.gif"
                alt="Dog and Cat Running"
                className="w-16 h-12 object-cover rounded-xl border border-amber-400/50 shadow"
              />
              <div className="text-left">
                <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                  <span>🐕</span>
                  <span>💨</span>
                  <span>🐈</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono ml-1">
                    PLAYING
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  Real buddy chase in action
                </div>
              </div>
            </div>

            {/* Little playful paw prints trailing */}
            <div className="flex space-x-3 text-xs text-amber-400/60 font-mono select-none">
              <span className="animate-pulse">🐾</span>
              <span className="animate-pulse delay-75">🐾</span>
              <span className="animate-pulse delay-150">🐾</span>
              <span className="animate-pulse delay-200">🐾</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Interactive Floating Ambient Background Controller (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-auto">
        {!showControls ? (
          <button
            type="button"
            onClick={() => setShowControls(true)}
            className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-850 text-slate-200 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/80 shadow-lg text-xs font-semibold backdrop-blur transition transform active:scale-95"
            title="Adjust Real Dog & Cat Background"
          >
            <span className="text-sm">🐶🐱</span>
            <span className="text-[11px] font-bold text-amber-400">Pet Play BG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>
        ) : (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs text-white space-y-2.5 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">🐕🐈</span>
                <span className="font-extrabold text-amber-300 text-[11px] uppercase tracking-wider">
                  Real Dog & Cat Background
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowControls(false)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Scene:</div>
              <div className="text-xs font-bold text-white truncate mt-0.5">
                {currentScene.name}
              </div>
              <div className="text-[10px] text-amber-200/80 italic mt-0.5">
                {currentScene.tagline}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={nextScene}
                className="flex-1 flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-1.5 px-2.5 rounded-xl text-[11px] shadow transition active:scale-95"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Next Play Clip</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRunner((prev) => !prev)}
                className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border transition ${
                  showRunner
                    ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle Running Mascot"
              >
                🏃 Runner: {showRunner ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Visibility:</span>
              <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleOpacityChange('subtle')}
                  className={`px-2 py-0.5 rounded ${
                    opacityMode === 'subtle'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Subtle
                </button>
                <button
                  type="button"
                  onClick={() => handleOpacityChange('balanced')}
                  className={`px-2 py-0.5 rounded ${
                    opacityMode === 'balanced'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Balanced
                </button>
                <button
                  type="button"
                  onClick={() => handleOpacityChange('vivid')}
                  className={`px-2 py-0.5 rounded ${
                    opacityMode === 'vivid'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vivid
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Runner track animation CSS */}
      <style>{`
        @keyframes petRunnerMove {
          0% {
            transform: translateX(-150px);
          }
          100% {
            transform: translateX(calc(100vw + 150px));
          }
        }
        .pet-runner-track {
          animation: petRunnerMove 16s linear infinite;
        }
      `}</style>
    </div>
  );
};
