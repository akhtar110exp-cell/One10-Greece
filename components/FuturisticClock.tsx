
import React, { useState, useEffect } from 'react';

const FuturisticClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secDeg = (seconds / 60) * 360;
  const minDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className="fixed top-8 right-8 z-[20000] select-none pointer-events-none group">
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .clock-container {
            width: 180px;
            height: 180px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .clock-ring {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(225, 173, 1, 0.1);
          }
          .ring-1 { width: 100%; height: 100%; border-width: 2px; border-style: dashed; animation: spin-slow 20s linear infinite; }
          .ring-2 { width: 85%; height: 85%; border-color: rgba(225, 173, 1, 0.3); animation: spin-reverse 15s linear infinite; }
          .ring-3 { width: 70%; height: 70%; background: radial-gradient(circle, rgba(225,173,1,0.05) 0%, transparent 70%); }
          
          .clock-face {
            width: 65%;
            height: 65%;
            background: #0A0A0A;
            border-radius: 50%;
            border: 2px solid rgba(225, 173, 1, 0.5);
            box-shadow: 0 0 30px rgba(225, 173, 1, 0.2), inset 0 0 20px rgba(0,0,0,1);
            position: relative;
            z-index: 10;
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom center;
            border-radius: 10px;
            z-index: 20;
          }
          .hand-hour { width: 4px; height: 25%; background: #fff; transform: translateX(-50%) rotate(${hourDeg}deg); }
          .hand-min { width: 3px; height: 35%; background: #E1AD01; transform: translateX(-50%) rotate(${minDeg}deg); }
          .hand-sec { width: 1px; height: 40%; background: #f43f5e; transform: translateX(-50%) rotate(${secDeg}deg); }
          
          .clock-center {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background: #E1AD01;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 30;
            box-shadow: 0 0 10px #E1AD01;
          }

          .digital-time {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 900;
            color: #E1AD01;
            letter-spacing: 0.2em;
            text-shadow: 0 0 10px rgba(225, 173, 1, 0.5);
          }
        `}
      </style>
      
      <div className="clock-container group-hover:scale-110">
        <div className="clock-ring ring-1"></div>
        <div className="clock-ring ring-2"></div>
        <div className="clock-ring ring-3"></div>
        
        <div className="clock-face">
          {/* Numbers/Ticks */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="mx-auto w-0.5 h-2 bg-white/20 mt-1"></div>
            </div>
          ))}
          
          <div className="hand hand-hour"></div>
          <div className="hand hand-min"></div>
          <div className="hand hand-sec"></div>
          <div className="clock-center"></div>
        </div>

        <div className="digital-time">
          {time.toLocaleTimeString([], { hour12: true })}
        </div>

        {/* Floating Data Decorators */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-px bg-[#E1AD01]/20"></div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-px bg-[#E1AD01]/20"></div>
      </div>
    </div>
  );
};

export default FuturisticClock;
