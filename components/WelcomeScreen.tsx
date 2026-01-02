
import React, { useEffect, useState, useRef } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'smoke' | 'text' | 'exit'>('smoke');
  const [isVisible, setIsVisible] = useState(true);
  
  const [welcomeText, setWelcomeText] = useState('');
  const [authorText, setAuthorText] = useState('');
  
  // Revert names to ONE10
  const welcomeFull = "WELCOME BY HEART FROM TEAM ONE10 EXPRESS";
  const authorFull = "AMMAR YASIR & HUSSAIN MUHAMMAD AWAN TEAM ONE10";
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTypingSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1500);
    const tExit = setTimeout(() => setPhase('exit'), 18500);
    const tComplete = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 20000);

    return () => {
      clearTimeout(t1);
      clearTimeout(tExit);
      clearTimeout(tComplete);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase !== 'text') return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < welcomeFull.length) {
        setWelcomeText(welcomeFull.substring(0, i + 1));
        playTypingSound();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'text') return;
    
    const delay = setTimeout(() => {
      let j = 0;
      const interval = setInterval(() => {
        if (j < authorFull.length) {
          setAuthorText(authorFull.substring(0, j + 1));
          playTypingSound();
          j++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 4500);

    return () => clearTimeout(delay);
  }, [phase]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-1000 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]">
          <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/30 to-rose-900/40 mix-blend-screen transition-opacity duration-[3000ms] ${phase === 'smoke' ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] bg-rose-500/10 rounded-full blur-[150px] animate-bounce duration-[10000ms]"></div>
          <div className="absolute top-[10%] right-[30%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse duration-[8000ms]"></div>
        </div>
      </div>

      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <div className={`transition-all duration-[2000ms] ease-out transform ${phase === 'text' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
          <div className="mb-8 inline-flex items-center gap-4">
             <div className="h-px w-12 bg-[#E1AD01]/50"></div>
             <span className="text-[12px] font-black text-[#E1AD01] uppercase tracking-[1em]">ONE10 SECURE ACCESS</span>
             <div className="h-px w-12 bg-[#E1AD01]/50"></div>
          </div>
          
          <div className="min-h-[160px] md:min-h-[220px] flex items-center justify-center">
            <h1 className="text-4xl md:text-7xl font-[1000] text-white tracking-tighter leading-tight max-w-5xl mx-auto mono uppercase">
              {welcomeText}<span className="animate-pulse inline-block w-1 h-8 md:h-14 bg-[#E1AD01] ml-1 align-middle"></span>
            </h1>
          </div>

          <div className={`mt-12 transition-all duration-[1500ms] ${authorText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Official Author Representation</span>
              <div className="px-12 py-6 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(225,173,1,0.3)] ring-1 ring-white/10">
                <p className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-[#E1AD01] tracking-tight mono drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  {authorText}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-[#E1AD01] animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></div>
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] animate-pulse">Initializing ONE10 Secure Portal Environment</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => { setIsVisible(false); onComplete(); }}
        className="absolute bottom-12 right-12 z-20 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest border border-slate-800 hover:border-white px-8 py-4 rounded-full transition-all bg-black/50 backdrop-blur-sm"
      >
        Skip Intro
      </button>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default WelcomeScreen;
