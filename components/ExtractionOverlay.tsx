
import React, { useEffect, useState, useRef } from 'react';

interface ExtractionOverlayProps {
  isVisible: boolean;
}

const ExtractionOverlay: React.FC<ExtractionOverlayProps> = ({ isVisible }) => {
  const [statusText, setStatusText] = useState("PLEASE WAIT: DATA IS BEING EXTRACTED");
  const [progress, setProgress] = useState(0);
  const audioEnglish = useRef<HTMLAudioElement | null>(null);
  const audioUrdu = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setStatusText("PLEASE WAIT: DATA IS BEING EXTRACTED");
      
      // Play English Voice
      if (audioEnglish.current) {
        audioEnglish.current.play().catch(e => console.log("Audio play blocked", e));
      }

      // Progress bar animation
      const interval = setInterval(() => {
        setProgress(prev => (prev < 95 ? prev + 1 : prev));
      }, 50);

      // Transition to Urdu Voice after 3.5 seconds
      const urduTimeout = setTimeout(() => {
        setStatusText("انتظار فرمائیے آپ کا ڈیٹا ایکسٹریکٹ کیا جا رہا ہے، شکریہ");
        if (audioUrdu.current) {
          audioUrdu.current.play().catch(e => console.log("Audio play blocked", e));
        }
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(urduTimeout);
        if (audioEnglish.current) {
          audioEnglish.current.pause();
          audioEnglish.current.currentTime = 0;
        }
        if (audioUrdu.current) {
          audioUrdu.current.pause();
          audioUrdu.current.currentTime = 0;
        }
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <style>
        {`
          @keyframes scanner-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes scan-line {
            0% { transform: translateY(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100px); opacity: 0; }
          }
          .scanner-ring-one10 {
            width: 200px;
            height: 200px;
            border: 4px solid #1a1a1a;
            border-top: 4px solid #f89d21;
            border-radius: 50%;
            animation: scanner-spin 1.5s linear infinite;
            position: relative;
            box-shadow: 0 0 50px rgba(248, 157, 33, 0.2);
          }
          .scanner-inner {
            position: absolute;
            inset: 15px;
            border: 2px solid rgba(255, 255, 255, 0.05);
            border-bottom: 2px solid #E1AD01;
            border-radius: 50%;
            animation: scanner-spin 2.5s linear infinite reverse;
          }
          .scan-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 140px;
            height: 2px;
            background: #f89d21;
            box-shadow: 0 0 20px #f89d21;
            transform: translate(-50%, -50%);
            animation: scan-line 2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Audio Sources */}
      <audio ref={audioEnglish} src="https://translate.google.com/translate_tts?ie=UTF-8&q=Please%20wait%20data%20is%20being%20extracted&tl=en&client=tw-ob" />
      <audio ref={audioUrdu} src="https://translate.google.com/translate_tts?ie=UTF-8&q=Intezar%20farmaiye%20apka%20data%20extract%20kia%20ja%20raha%20ha%20Shukria&tl=ur&client=tw-ob" />

      <div className="relative mb-12">
        <div className="scanner-ring-one10">
          <div className="scanner-inner"></div>
          <div className="scan-effect"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">Scanning</span>
        </div>
      </div>

      <h2 className="text-3xl font-[1000] text-[#f89d21] uppercase tracking-[0.3em] mb-4 text-center px-6 drop-shadow-[0_0_10px_rgba(248,157,33,0.5)]">
        EXTRACTING DATA...
      </h2>
      
      <div className="h-24 flex items-center justify-center mb-8">
        <p className="text-white text-xl font-bold uppercase tracking-tight text-center max-w-xl px-10 transition-all duration-500">
          {statusText}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-80 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-2xl">
        <div 
          className="h-full bg-gradient-to-r from-[#f89d21] to-[#e67e22] rounded-full transition-all duration-300 shadow-[0_0_15px_#f89d21]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="mt-8 text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] flex items-center gap-4">
        <span>Processing Buffers</span>
        <span className="animate-bounce">...</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export default ExtractionOverlay;
