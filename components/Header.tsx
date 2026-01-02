
import React, { useState, useEffect } from 'react';
import { EXTERNAL_PORTAL_URL, CREATE_ACCOUNT_URL, LOGIN_URL, GMAIL_GENERATOR_URL, ATOMIC_MAIL_URL } from '../constants';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <header className="sticky top-0 z-[100] bg-black border-b border-white/10 shadow-[0_25px_80px_rgba(0,0,0,1)] overflow-hidden h-28">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

          /* FLAG DUEL SYSTEM */
          .flag-duel-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 120px;
            perspective: 1200px;
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0.15;
            z-index: 0;
          }

          .flag-base {
            width: 240px;
            height: 160px;
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,1);
            animation-duration: 8s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            transform-style: preserve-3d;
          }

          .pakistan-flag-css {
            background-color: #00401A;
            animation-name: duel;
          }
          .pakistan-flag-css::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 25%;
            background: white;
          }
          .pakistan-flag-css::after {
            content: '🌙⭐';
            position: absolute;
            left: 62.5%; top: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 50px;
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));
          }

          .greece-flag-css {
            background: repeating-linear-gradient(
              180deg,
              #005BAB 0px, #005BAB 17.7px,
              white 17.7px, white 35.4px
            );
            animation-name: duel;
            animation-delay: -4s;
          }
          .greece-flag-css::before {
            content: '';
            position: absolute;
            left: 0; top: 0;
            width: 40%;
            height: 55.5%;
            background: #005BAB;
          }
          .greece-flag-css::after {
            content: '+';
            position: absolute;
            left: 0; top: 0;
            width: 40%;
            height: 55.5%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 80px;
            font-weight: 100;
          }

          @keyframes duel {
            0% { transform: rotateY(0deg) translateZ(-200px) scale(0.8); opacity: 0.4; filter: blur(4px); z-index: 1; }
            25% { transform: rotateY(90deg) translateZ(0px) scale(1); opacity: 0.8; filter: blur(0px); }
            50% { transform: rotateY(180deg) translateZ(200px) scale(1.2); opacity: 1; filter: blur(0px); z-index: 2; }
            75% { transform: rotateY(270deg) translateZ(0px) scale(1); opacity: 0.8; filter: blur(0px); }
            100% { transform: rotateY(360deg) translateZ(-200px) scale(0.8); opacity: 0.4; filter: blur(4px); z-index: 1; }
          }

          .header-vignette {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 20%, black 100%);
            z-index: 5;
            pointer-events: none;
          }

          /* HUSAYN TEXT COMPONENT */
          .husayn-text {
            color: #ffffff;
            font-family: 'Amiri', serif;
            font-size: 3rem;
            text-align: center;
            direction: rtl;
            margin: 40px 0;
            cursor: default;
            user-select: none;
            white-space: nowrap;
            opacity: 0;
            animation: glowRise 1s ease-out forwards, pulse 4s infinite 3s, driftHorizontal 10s ease-in-out infinite;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* 1. Entrance Animation: Fades in and moves up */
          @keyframes glowRise {
            0% {
              opacity: 0;
              transform: translateY(20px);
              text-shadow: 0 0 0px rgba(255, 255, 255, 0);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
              text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
            }
          }

          /* 2. Loop Animation: A soft breathing/pulsing effect */
          @keyframes pulse {
            0%, 100% {
              text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
              transform: scale(1);
            }
            50% {
              text-shadow: 0 0 25px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.5);
              transform: scale(1.02);
            }
          }

          /* 3. Horizontal Drift Animation */
          @keyframes driftHorizontal {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-30px); }
            75% { transform: translateX(30px); }
          }
        `}
      </style>
      
      {/* THEME BACKGROUND: FLAG DUEL */}
      <div className="flag-duel-container">
        <div className="flag-base pakistan-flag-css"></div>
        <div className="flag-base greece-flag-css"></div>
      </div>
      <div className="header-vignette"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-14 relative z-10 flex items-center h-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-12">
            {/* BRAND LOGO UNIT */}
            <div className="flex flex-col items-center group cursor-pointer transition-all duration-700 hover:scale-110 active:scale-95">
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-[1000] tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">ONE</span>
                <span className="text-5xl font-[1000] tracking-tighter text-[#E1AD01] drop-shadow-[0_0_35px_rgba(225,173,1,0.6)]">1</span>
                <span className="text-5xl font-[1000] tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">0</span>
              </div>
              <div className="flex items-center w-full gap-3 -mt-2">
                <div className="h-[1px] flex-grow bg-white/30"></div>
                <div className="flex items-center text-[11px] font-black uppercase tracking-[0.4em] italic drop-shadow-[0_10px_10px_rgba(0,0,0,1)]">
                  <span className="text-[#E1AD01]">EX</span>
                  <span className="text-white">press</span>
                </div>
                <div className="h-[1px] flex-grow bg-white/30"></div>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col border-l border-white/20 pl-10">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em] mb-1">GLOBAL VAULT</span>
              <div className="bg-black/60 px-5 py-2 rounded-xl border border-white/10 inline-flex items-center gap-3">
                <div className="w-2 h-2 bg-[#E1AD01] rounded-full animate-ping"></div>
                <span className="mono text-[13px] font-black text-[#E1AD01] tracking-widest uppercase">
                  {formatTime(time)}
                </span>
              </div>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-12">
            <div className="flex items-center gap-8">
              <a href={GMAIL_GENERATOR_URL} target="_blank" className="text-[11px] font-black text-white/60 hover:text-[#E1AD01] uppercase tracking-[0.2em] transition-all">Gmail Gen</a>
              <a href={ATOMIC_MAIL_URL} target="_blank" className="text-[11px] font-black text-white/60 hover:text-[#E1AD01] uppercase tracking-[0.2em] transition-all">Atomicmail</a>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex items-center gap-8">
              <a href={CREATE_ACCOUNT_URL} target="_blank" className="text-[11px] font-black text-white/60 hover:text-[#E1AD01] uppercase tracking-[0.2em] transition-all">Register</a>
              <a href={LOGIN_URL} target="_blank" className="text-[11px] font-black text-white/60 hover:text-[#E1AD01] uppercase tracking-[0.2em] transition-all">Login</a>
            </div>
            
            {/* UPDATED HUSAYN TEXT WITH NEW CONTENT AND ANIMATIONS */}
            <div className="husayn-text">بسمِ رَبِ الحُسینؑ</div>
          </nav>
        </div>
      </div>
      
      {/* BOTTOM ACCENT */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E1AD01] to-transparent"></div>
    </header>
  );
};

export default Header;
