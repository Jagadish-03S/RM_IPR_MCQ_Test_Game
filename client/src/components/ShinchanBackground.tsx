import React from 'react';

export const ShinchanBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-950">
      {/* Cartoon Shinchan Playing Animated GIF - Clear & High Visibility */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <img
          src="/media/shinchan_playing.gif"
          alt="Shinchan Playing Background"
          onError={(e) => {
            // Direct verified CDN fallback
            (e.target as HTMLImageElement).src =
              'https://media.tenor.com/Y-eAadlEHKkAAAAC/dancing-dance-moves.gif';
          }}
          className="w-full h-full object-cover opacity-75 filter brightness-105 contrast-110"
        />

        {/* Soft subtle radial ambient vignette so text and cards remain crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-slate-950/50 pointer-events-none" />
      </div>
    </div>
  );
};
