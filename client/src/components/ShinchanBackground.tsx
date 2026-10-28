import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ShinchanScene {
  id: string;
  name: string;
  tagline: string;
  src: string;
  fallbackSrc: string;
}

const SHINCHAN_SCENES: ShinchanScene[] = [
  {
    id: 'shinchan-play-dance',
    name: 'Shinchan Playing & Dancing',
    tagline: 'Classic Crayon Shinchan happy dance & playtime',
    src: '/media/shinchan_playing.gif',
    fallbackSrc: 'https://media.tenor.com/Y-eAadlEHKkAAAAC/dancing-dance-moves.gif'
  },
  {
    id: 'shinchan-fun',
    name: 'Shinchan Happy Vibes',
    tagline: 'Shinchan enjoying playful cartoon fun',
    src: '/media/shinchan_fun.gif',
    fallbackSrc: 'https://media.tenor.com/0SWq7XNGWOMAAAAC/shin-chan.gif'
  }
];

export const ShinchanBackground: React.FC = () => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [opacityMode, setOpacityMode] = useState<'subtle' | 'balanced' | 'vivid'>('balanced');
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rm_ipr_shinchan_bg_opacity');
    if (saved === 'subtle' || saved === 'balanced' || saved === 'vivid') {
      setOpacityMode(saved);
    }
  }, []);

  const handleOpacityChange = (mode: 'subtle' | 'balanced' | 'vivid') => {
    setOpacityMode(mode);
    localStorage.setItem('rm_ipr_shinchan_bg_opacity', mode);
  };

  const nextScene = () => {
    setSceneIdx((prev) => (prev + 1) % SHINCHAN_SCENES.length);
  };

  const currentScene = SHINCHAN_SCENES[sceneIdx];

  // Opacity styles for background
  const opacityClass =
    opacityMode === 'vivid'
      ? 'opacity-60'
      : opacityMode === 'subtle'
      ? 'opacity-20'
      : 'opacity-40';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Cartoon Shinchan Playing GIF Background */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <img
          src={currentScene.src}
          alt={currentScene.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = currentScene.fallbackSrc;
          }}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${opacityClass} filter contrast-110 saturate-115`}
        />
        {/* Ambient Dark Overlay for high UI contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
      </div>

      {/* Floating Ambient Controls (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-auto">
        {!showControls ? (
          <button
            type="button"
            onClick={() => setShowControls(true)}
            className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/80 shadow-lg text-xs font-semibold backdrop-blur transition transform active:scale-95"
            title="Adjust Shinchan Background"
          >
            <span className="text-sm">👦</span>
            <span className="text-[11px] font-bold text-amber-400">Shinchan BG</span>
          </button>
        ) : (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs text-white space-y-2.5 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">👦🖍️</span>
                <span className="font-extrabold text-amber-300 text-[11px] uppercase tracking-wider">
                  Shinchan Background
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
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Scene:</div>
              <div className="text-xs font-bold text-white truncate mt-0.5">
                {currentScene.name}
              </div>
              <div className="text-[10px] text-amber-200/80 italic mt-0.5">
                {currentScene.tagline}
              </div>
            </div>

            {SHINCHAN_SCENES.length > 1 && (
              <button
                type="button"
                onClick={nextScene}
                className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold py-1.5 px-2.5 rounded-xl text-[11px] shadow transition active:scale-95"
              >
                <Sparkles className="w-3 h-3" />
                <span>Switch Shinchan Scene</span>
              </button>
            )}

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
    </div>
  );
};
