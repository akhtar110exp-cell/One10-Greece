
import React, { useState, useEffect, useRef } from 'react';

interface LoginScreenProps {
  onStart: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hourHandRef = useRef<HTMLDivElement>(null);
  const minHandRef = useRef<HTMLDivElement>(null);
  const secHandRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef<number>(null);

  const animateClock = () => {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();
    const ms = now.getMilliseconds();

    const sDeg = (s + ms / 1000) * 6;
    const mDeg = (m * 6) + (s * 0.1);
    const hDeg = ((h % 12) * 30) + (m * 0.5);

    if (secHandRef.current) secHandRef.current.style.transform = `translateX(-50%) rotate(${sDeg}deg)`;
    if (minHandRef.current) minHandRef.current.style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
    if (hourHandRef.current) hourHandRef.current.style.transform = `translateX(-50%) rotate(${hDeg}deg)`;

    requestRef.current = requestAnimationFrame(animateClock);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateClock);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || isExiting) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      cardRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isExiting]);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setIsExiting(true);
    setTimeout(() => {
      onStart();
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden transition-all duration-[1500ms] ${isExiting ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-none'}`}>
      <style>
        {`
          .bg-video {
            position: fixed; right: 0; bottom: 0; min-width: 100%; min-height: 100%;
            z-index: -1; filter: brightness(0.25); object-fit: cover;
          }
          .overlay-login {
            position: absolute; inset: 0;
            background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, #000 100%);
            z-index: 1;
          }
          .card-perspective {
            perspective: 1000px;
            z-index: 10;
            margin-bottom: 50px;
          }
          .wooden-card {
            width: 480px;
            height: 280px;
            background: url('https://www.transparenttextures.com/patterns/wood-pattern.png'), 
                        linear-gradient(135deg, #4e342e 0%, #21100b 100%);
            background-blend-mode: overlay;
            border-radius: 30px;
            padding: 35px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 50px 100px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.5);
            transform-style: preserve-3d;
            transition: transform 0.1s ease-out;
            border: 1px solid rgba(255,255,255,0.05);
          }
          .inner-content {
            transform: translateZ(60px);
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          }
          .clock-container {
            width: 170px;
            height: 170px;
            background: white url('images.jpg') no-repeat center;
            background-size: cover;
            border-radius: 50%;
            border: 6px solid #1a1a1a;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          }
          .clock-num {
            position: absolute;
            color: #cc0000;
            font-weight: 900;
            font-size: 24px;
            font-family: 'Inter', sans-serif;
          }
          .n12 { top: 6px; left: 50%; transform: translateX(-50%); }
          .n3 { right: 12px; top: 50%; transform: translateY(-50%); }
          .n6 { bottom: 6px; left: 50%; transform: translateX(-50%); }
          .n9 { left: 12px; top: 50%; transform: translateY(-50%); }
          .hand { position: absolute; bottom: 50%; left: 50%; transform-origin: bottom center; background: #000; border-radius: 5px; }
          .hour { width: 6px; height: 45px; z-index: 3; }
          .min { width: 4px; height: 60px; z-index: 2; }
          .sec { width: 2px; height: 65px; background: #cc0000; z-index: 1; }
          .center-dot { position: absolute; top: 50%; left: 50%; width: 10px; height: 10px; background: #1a1a1a; border-radius: 50%; transform: translate(-50%, -50%); z-index: 10; border: 1px solid white; }
          .card-info { text-align: right; color: #fff; }
          .chip { width: 55px; height: 40px; background: linear-gradient(45deg, #d4af37, #f89d21); border-radius: 8px; margin-left: auto; margin-bottom: 50px; box-shadow: inset 0 0 10px rgba(0,0,0,0.3); }
          .present-text { font-size: 9pt; color: #f89d21; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px rgba(248,157,33,0.3); }
          .start-btn {
            padding: 22px 90px;
            background: linear-gradient(135deg, #f89d21, #e67e22);
            border: none;
            border-radius: 60px;
            color: white;
            font-size: 18pt;
            font-weight: 900;
            cursor: pointer;
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 15px 45px rgba(248, 157, 33, 0.5);
            text-transform: uppercase;
          }
          .start-btn:hover { transform: scale(1.1); filter: brightness(1.25); box-shadow: 0 20px 60px rgba(248, 157, 33, 0.7); }
          .login-title { font-size: 50pt; font-weight: 1000; color: #fff; letter-spacing: 12px; text-shadow: 0 10px 40px rgba(0,0,0,1); }
          .login-subtitle { font-size: 12pt; color: #f89d21; font-weight: 800; letter-spacing: 3px; margin: 15px 0 60px 0; text-transform: uppercase; max-width: 600px; line-height: 1.6; }
        `}
      </style>

      <video autoPlay muted loop playsInline className="bg-video">
        <source src="crypto_disc.mp4" type="video/mp4" />
      </video>
      <div className="overlay-login"></div>

      <audio ref={audioRef}>
        <source src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/foley_door_heavy_wood_open.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative z-10 flex flex-col items-center">
        <div className="card-perspective">
          <div className="wooden-card" ref={cardRef}>
            <div className="inner-content">
              <div className="clock-container">
                <div className="clock-num n12">12</div>
                <div className="clock-num n3">3</div>
                <div className="clock-num n6">6</div>
                <div className="clock-num n9">9</div>
                <div className="hand hour" ref={hourHandRef}></div>
                <div className="hand min" ref={minHandRef}></div>
                <div className="hand sec" ref={secHandRef}></div>
                <div className="center-dot"></div>
              </div>
              <div className="card-info">
                <div className="chip"></div>
                <div style={{ fontSize: '26pt', fontWeight: 1000, letterSpacing: '3px' }}>ONE10</div>
                <div className="present-text">PRESENT BY SYED AMMAR</div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="login-title">ONE10 EXPRESS</h1>
        <div className="login-subtitle text-center">SCAN AND FETCH DETAILS FOR GREECE PERMIT ACKNOWLEDGEMENT</div>
        
        <button className="start-btn" onClick={handleStart}>
          START IN ONE10 WORLD
        </button>
      </div>

      <div className="absolute bottom-10 left-10 text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] z-20">
        ONE10_SYSTEM: OPERATIONAL<br/>
        SECURITY_LEVEL: OMEGA_REDACTED
      </div>
    </div>
  );
};

export default LoginScreen;
