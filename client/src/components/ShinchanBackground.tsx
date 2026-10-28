import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders } from 'lucide-react';

interface ShinchanScene {
  id: string;
  name: string;
  src: string;
  fallbackSrc: string;
}

const SHINCHAN_SCENES: ShinchanScene[] = [
  {
    id: 'shinchan-playing',
    name: 'Shinchan Playing & Dancing',
    src: '/media/shinchan_playing.gif',
    fallbackSrc: 'https://media.tenor.com/Y-eAadlEHKkAAAAC/dancing-dance-moves.gif'
  },
  {
    id: 'shinchan-fun',
    name: 'Shinchan Joyful Vibes',
    src: '/media/shinchan_fun.gif',
    fallbackSrc: 'https://media.tenor.com/0SWq7XNGWOMAAAAC/shin-chan.gif'
  }
];

export const ShinchanBackground: React.FC = () => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [opacityMode, setOpacityMode] = useState<'subtle' | 'balanced' | 'vivid'>('subtle');
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

  const opacityClass =
    opacityMode === 'vivid'
      ? 'opacity-40'
      : opacityMode === 'balanced'
      ? 'opacity-25'
      : 'opacity-15';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Animated Shinchan Playing GIF */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <img
          src={currentScene.src}
          alt={currentScene.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = currentScene.fallbackSrc;
          }}
          className={`w-full h-full object-cover sm:object-contain transition-opacity duration-700 ease-in-out ${opacityClass} filter brightness-90 contrast-105`}
        />
        {/* Soft Modern Dark Gradient Layer */}
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px]" />
      </div>

      {/* Minimalist Floating Controls (Bottom Left - subtle on mobile) */}
      <div className="fixed bottom-3 left-3 z-30 pointer-events-auto">
        {!showControls ? (
          <button
            type="button"
            onClick={() => setShowControls(true)}
            className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-full border border-slate-800 shadow-md text-[11px] font-medium backdrop-blur transition active:scale-95"
            title="Shinchan Animation Settings"
          >
            <span>👦</span>
            <span className="hidden sm:inline">Shinchan Theme</span>
            <Sliders className="w-3 h-3 text-slate-400" />
          </button>
        ) : (
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs text-white space-y-2 max-w-[260px] animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-amber-300 text-[11px] flex items-center space-x-1">
                <span>👦</span>
                <span>Shinchan Theme</span>
              </span>
              <button
                type="button"
                onClick={() => setShowControls(false)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={nextScene}
                className="flex-1 flex items-center justify-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium py-1 px-2 rounded-lg border border-slate-700 transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Next Animation</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Theme Opacity:</span>
              <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                {(['subtle', 'balanced', 'vivid'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleOpacityChange(m)}
                    className={`px-1.5 py-0.5 rounded capitalize ${
                      opacityMode === m
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
