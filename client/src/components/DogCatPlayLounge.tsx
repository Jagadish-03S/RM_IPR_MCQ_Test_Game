import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Smile
} from 'lucide-react';

interface PetScene {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  localSrc: string;
  fallbackSrc: string;
  description: string;
}

const PET_SCENES: PetScene[] = [
  {
    id: 'buddies-boop',
    title: 'The Gentle Paws & Nose Boop',
    subtitle: 'Golden Retriever & Kitten Best Friends',
    badge: 'Gentle Play',
    localSrc: '/media/dog_cat_play1.gif',
    fallbackSrc: 'https://media.giphy.com/media/hPyONzUYJhLZS/giphy.gif',
    description: 'Watch this sweet real-life golden retriever and curious kitten exchange affectionate paw taps and nose boops!'
  },
  {
    id: 'livingroom-wrestle',
    title: 'Carpet Tag & Playful Wrestling',
    subtitle: 'Energetic Duo Having Pure Fun',
    badge: 'Tumble Mania',
    localSrc: '/media/dog_cat_play2.gif',
    fallbackSrc: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
    description: 'Real dog and cat tumbling safely together on the living room rug with playful tail wags and soft paws.'
  },
  {
    id: 'peekaboo-tag',
    title: 'Sneak Attack & Cozy Chase',
    subtitle: 'Fluffy Duo In High Spirits',
    badge: 'Action Tag',
    localSrc: '/media/dog_cat_play3.gif',
    fallbackSrc: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif',
    description: 'Peek-a-boo games under the couch! Watch the kitten playfully stalk and pounce around their gentle canine brother.'
  },
  {
    id: 'head-taps',
    title: 'The Royal Snoot Tapper',
    subtitle: 'Cat Claiming Canine Crown',
    badge: 'Pure Comedy',
    localSrc: '/media/dog_cat_play4.gif',
    fallbackSrc: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif',
    description: 'Cat gently patting dog on the head while the dog sits happily wagging its tail, completely enjoying the attention.'
  }
];

const PET_JOKES = [
  "Why do dogs make great researchers? Because they never stop digging for the facts!",
  "What did the cat say when the dog cited their paper? 'You better have included proper attribution!'",
  "Why did the puppy get a patent? Because its tail-wagging invention was novel and non-obvious!",
  "A dog and a cat walked into an exam hall... the dog brought a lucky tennis ball, and the cat solved all 100 questions in 10 minutes flat!",
  "Cat: 'I am the principal investigator.' Dog: 'And I am the chief happiness officer!'",
  "How do dogs protect their intellectual property? With a trademark bark!"
];

export const DogCatPlayLounge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loveCount, setLoveCount] = useState(128);
  const [hasLoved, setHasLoved] = useState(false);
  const [jokeIdx, setJokeIdx] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API on user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Sound generator helpers
  const playBoingSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.35);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio not permitted or supported
    }
  };

  const playMunchSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio not permitted
    }
  };

  const playPurrChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const now = ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {
      // Audio not permitted
    }
  };

  // Add floating action particle
  const triggerParticle = (icon: string) => {
    const newId = Date.now() + Math.random();
    const x = 30 + Math.random() * 40;
    const y = 40 + Math.random() * 20;
    setFloatingParticles((prev) => [...prev, { id: newId, icon, x, y }]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 1200);
  };

  const handleTossBall = () => {
    triggerParticle('🎾');
    playBoingSound();
  };

  const handleFeedSnack = () => {
    triggerParticle('🥩');
    playMunchSound();
  };

  const handleBellyRub = () => {
    triggerParticle('💖');
    playPurrChime();
    setLoveCount((c) => c + 1);
    setHasLoved(true);
  };

  const nextScene = () => {
    setCurrentSceneIdx((prev) => (prev + 1) % PET_SCENES.length);
  };

  const prevScene = () => {
    setCurrentSceneIdx((prev) => (prev - 1 + PET_SCENES.length) % PET_SCENES.length);
  };

  const nextJoke = () => {
    setJokeIdx((prev) => (prev + 1) % PET_JOKES.length);
  };

  const activeScene = PET_SCENES[currentSceneIdx];

  // Prevent closing on escape if in fullscreen
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (fullscreen) setFullscreen(false);
        else setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, fullscreen]);

  return (
    <>
      {/* Floating Action Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/30 backdrop-blur"
          title="Open Real Dog & Cat Play Lounge (Stress Relief)"
        >
          <span className="text-xl animate-bounce">🐾</span>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-wide uppercase">Dog & Cat Lounge</div>
            <div className="text-[10px] text-amber-100 font-medium">Real Pet Playtime • Stress Relief</div>
          </div>
          <span className="sm:hidden text-xs font-bold">Pet Lounge</span>
        </button>
      </div>

      {/* Interactive Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 relative ${
              fullscreen
                ? 'w-full h-full max-w-none rounded-none'
                : 'w-full max-w-2xl max-h-[92vh]'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl">🐶🐱</span>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <span>Real Dog & Cat Play Lounge</span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      100% Real Footage
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Relax your mind with real furry best friends playing together
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {/* Audio Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition ${
                    soundEnabled
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={soundEnabled ? 'Interactive Sound Effects Active' : 'Enable Interactive Sound Effects'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setFullscreen((prev) => !prev)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen Lounge'}
                >
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Close Lounge"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative bg-black flex-1 min-h-[260px] sm:min-h-[360px] flex items-center justify-center overflow-hidden select-none">
              <img
                src={activeScene.localSrc}
                alt={activeScene.title}
                onError={(e) => {
                  // Fallback to verified direct CDN if local asset is loading
                  (e.target as HTMLImageElement).src = activeScene.fallbackSrc;
                }}
                className="w-full h-full object-contain max-h-[60vh]"
              />

              {/* Floating Reaction Particles */}
              {floatingParticles.map((p) => (
                <div
                  key={p.id}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute pointer-events-none text-3xl sm:text-4xl animate-bounce transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
                >
                  {p.icon}
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={prevScene}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur border border-white/20 transition shadow-lg"
                title="Previous Real Clip"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextScene}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur border border-white/20 transition shadow-lg"
                title="Next Real Clip"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Scene Badge Overlay */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-[11px] text-white flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-semibold">{activeScene.badge}</span>
                <span className="text-slate-400">• Clip {currentSceneIdx + 1} of {PET_SCENES.length}</span>
              </div>
            </div>

            {/* Interactive Control Dashboard */}
            <div className="p-4 sm:p-5 bg-slate-900 space-y-4 shrink-0">
              {/* Scene Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {activeScene.title}
                  </h4>
                  <p className="text-xs text-amber-300 font-medium">
                    {activeScene.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-lg">
                    {activeScene.description}
                  </p>
                </div>

                {/* Love Counter */}
                <button
                  type="button"
                  onClick={handleBellyRub}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition self-start sm:self-auto ${
                    hasLoved
                      ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                  title="Give Belly Rub & Scratches"
                >
                  <Heart className={`w-4 h-4 ${hasLoved ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
                  <span>{loveCount} Belly Rubs</span>
                </button>
              </div>

              {/* Entertaining Interactive Action Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold uppercase text-slate-400 mr-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interact:</span>
                </span>

                <button
                  type="button"
                  onClick={handleTossBall}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  <span>🎾</span>
                  <span>Toss Tennis Ball</span>
                </button>

                <button
                  type="button"
                  onClick={handleFeedSnack}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  <span>🥩</span>
                  <span>Give Yummy Treat</span>
                </button>

                <button
                  type="button"
                  onClick={handleBellyRub}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-95 text-white rounded-xl text-xs font-semibold shadow transition"
                >
                  <span>✨</span>
                  <span>Give Love & Purrs</span>
                </button>

                <button
                  type="button"
                  onClick={nextJoke}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-700/60 active:scale-95 rounded-xl text-xs font-semibold transition ml-auto"
                  title="Show another pet joke"
                >
                  <Smile className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Next Joke</span>
                </button>
              </div>

              {/* Hilarious Pet Joke / Stress Relief Fact */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-amber-400 text-sm">💡</span>
                <p className="italic text-slate-300">
                  "{PET_JOKES[jokeIdx]}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
