
import React, { useState, useEffect } from 'react';
import FuturisticClock from './FuturisticClock';

interface SecurityGateProps {
  onAuthorized: (level: 'admin' | 'client') => void;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ onAuthorized }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorStrobe, setShowErrorStrobe] = useState(false);

  // SECURE MASTER CIPHERS
  const ADMIN_CODE = "2892";
  const CLIENT_CODE = "0852"; 
  
  const handleInput = (digit: string) => {
    if (pin.length < 4) {
      setError(false);
      setPin(prev => prev + digit);
    }
  };

  const clearPin = () => setPin('');
  const deleteLast = () => setPin(prev => prev.slice(0, -1));

  // KEYBOARD SUPPORT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;
      
      if (/^[0-9]$/.test(e.key)) {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        deleteLast();
      } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        clearPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, loading]);

  useEffect(() => {
    if (pin.length === 4) {
      setLoading(true);
      const timer = setTimeout(async () => {
        if (pin === ADMIN_CODE) {
          onAuthorized('admin');
        } else if (pin === CLIENT_CODE) {
          onAuthorized('client');
        } else {
          setError(true);
          setShowErrorStrobe(true);
          setPin('');
          setLoading(false);
          setTimeout(() => setShowErrorStrobe(false), 3000);
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [pin, onAuthorized]);

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 font-sans overflow-hidden transition-colors duration-300 ${showErrorStrobe ? 'bg-red-950/40' : 'bg-[#000000]'}`}>
      <FuturisticClock />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <style>
          {`
            @keyframes binary-rain { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
            .coding-rain-column { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(225, 173, 1, 0.4); line-height: 1.2; white-space: pre; position: absolute; animation: binary-rain 5s linear infinite; text-shadow: 0 0 5px rgba(225, 173, 1, 0.5); }
            .cyber-grid-one10 { background-image: linear-gradient(rgba(225, 173, 1, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(225, 173, 1, 0.05) 1px, transparent 1px); background-size: 50px 50px; opacity: 0.5; }
            .strobe-alert-one10 { animation: strobe-pulse 0.1s infinite; background: rgba(255, 0, 0, 0.4); position: absolute; inset: 0; z-index: 50; }
            @keyframes strobe-pulse { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
            @keyframes shadow-pulse-secure { 0%, 100% { box-shadow: 0 0 20px rgba(225, 173, 1, 0.1); } 50% { box-shadow: 0 0 40px rgba(225, 173, 1, 0.3); } }
            .secure-gate-container { animation: shadow-pulse-secure 4s ease-in-out infinite; }
          `}
        </style>
        <div className="absolute inset-0 cyber-grid-one10"></div>
        {[...Array(25)].map((_, i) => (
          <div key={i} className="coding-rain-column" style={{ left: `${i * 4}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }}>
            {Array(50).fill(0).map((__, j) => (<div key={j}>{Math.floor(Math.random() * 2)}</div>))}
          </div>
        ))}
      </div>

      {showErrorStrobe && <div className="strobe-alert-one10"></div>}

      <div className="max-w-lg w-full flex flex-col items-center relative z-[101]">
        <div className={`bg-black/95 backdrop-blur-3xl rounded-[60px] p-20 border-4 transition-all duration-300 shadow-[0_40px_200px_rgba(0,0,0,1)] secure-gate-container ${showErrorStrobe ? 'border-rose-600 shadow-[0_0_150px_rgba(255,0,0,0.7)]' : 'border-[#E1AD01]/30'}`}>
          <div className="mb-16 text-center w-full flex flex-col items-center">
            <div className="flex flex-col items-center mb-12 scale-110">
               <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-[1000] tracking-tighter text-white">ONE</span>
                  <span className="text-7xl font-[1000] tracking-tighter text-[#E1AD01]">1</span>
                  <span className="text-7xl font-[1000] tracking-tighter text-white">0</span>
               </div>
               <div className="flex items-center w-full gap-4 -mt-2 opacity-60">
                  <div className="h-[3px] flex-grow bg-white/30"></div>
                  <div className="flex items-center text-2xl font-black uppercase tracking-[0.3em] italic text-white">
                    <span className="text-[#E1AD01]">EX</span>press
                  </div>
                  <div className="h-[3px] flex-grow bg-white/30"></div>
               </div>
            </div>

            <div className="inline-flex items-center gap-4 mb-14 px-10 py-4 bg-black border-2 border-white/5 rounded-full shadow-2xl">
                <div className="w-3 h-3 rounded-full bg-[#E1AD01] animate-ping"></div>
                <span className="text-[#E1AD01] text-[12px] font-black tracking-[0.6em] uppercase">SYSTEM VAULT AUTHENTICATION</span>
            </div>
            
            <div className="flex justify-center gap-6">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${pin.length > i ? 'bg-[#E1AD01] border-[#E1AD01] shadow-[0_0_80px_#E1AD01] scale-110' : 'bg-black border-white/10'}`}>
                  {pin.length > i && <div className="w-5 h-5 bg-black rounded-md rotate-45 animate-in zoom-in-50"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((val) => (
              <button
                key={val}
                disabled={loading}
                onClick={() => {
                  if (val === 'C') clearPin();
                  else if (val === '⌫') deleteLast();
                  else handleInput(val);
                }}
                className={`w-20 h-20 rounded-3xl bg-[#080808] border-2 border-white/5 flex items-center justify-center text-3xl font-[1000] text-white hover:border-[#E1AD01] hover:bg-[#111] hover:scale-110 active:scale-90 transition-all shadow-xl ${val === 'C' || val === '⌫' ? 'text-rose-600 opacity-60' : ''}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Physical Keyboard Enabled</p>
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 px-12 py-5 rounded-2xl animate-shake">
               <p className="text-rose-500 font-black text-sm uppercase tracking-[0.5em]">SECURITY BREACH: CIPHER MISMATCH</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center gap-8">
               <div className="flex gap-4">
                  {[0,1,2,3,4].map(i => <div key={i} className="w-3 h-12 bg-[#E1AD01] rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>)}
               </div>
               <p className="text-[#E1AD01] font-black text-sm uppercase tracking-[0.8em] animate-pulse">ESTABLISHING ENCRYPTED NODE...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* BACKGROUND DECORATORS */}
      <div className="absolute top-12 left-12 flex flex-col gap-3 opacity-20 font-mono text-[9px] uppercase tracking-[0.4em] text-white pointer-events-none">
          <span>SECURE_ENCRYPTION: AES_SHA_256</span>
          <span>PROTOCOL_LAYER: ONE10_V9_STRICT</span>
          <span>ACCESS_LEVEL: UNAUTHORIZED</span>
          <div className="w-20 h-px bg-white/20 mt-2"></div>
      </div>
    </div>
  );
};

export default SecurityGate;
