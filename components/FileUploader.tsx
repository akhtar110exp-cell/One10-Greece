
import React from 'react';
import { FileState } from '../types';

interface FileUploaderProps {
  label: string;
  id: string;
  onFileSelect: (file: File | null) => void;
  fileState: FileState;
  variant?: 'pakistan' | 'greece';
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, id, onFileSelect, fileState, variant }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isPakistan = variant === 'pakistan';

  return (
    <div className="flex flex-col space-y-4 group/uploader h-full">
      <style>
        {`
          :root {
            --flag-green: #00401A;
            --flag-white: #FFFFFF;
            --flag-blue: #014488;
          }

          /* SHARED SIMPLE WAVE FOR PAKISTAN */
          @keyframes simple-wave {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.05) rotate(1deg); }
            100% { transform: scale(1) rotate(0deg); }
          }

          /* COLUMNAR WAVING FOR GREECE */
          @keyframes waving {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          .elegant-flag-container {
            position: absolute;
            inset: 0;
            overflow: hidden;
            z-index: 0;
          }

          /* PAKISTAN SPECIFIC */
          .pk-wave {
            animation: simple-wave 4s infinite ease-in-out;
            width: 100%;
            height: 100%;
            position: relative;
          }

          .white-bar {
            position: absolute;
            left: 0; top: 0; height: 100%; width: 25%;
            background-color: var(--flag-white);
            opacity: 0.9;
          }

          .green-field {
            position: absolute;
            left: 25%; top: 0; height: 100%; width: 75%;
            background-color: var(--flag-green);
          }

          .crescent-star-wrapper {
            position: absolute;
            left: 62.5%; top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .crescent-symbol {
            font-size: 80px;
            color: white;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.4));
            transform: translateX(-10%);
          }

          .star-symbol {
            font-size: 30px;
            color: white;
            filter: drop-shadow(0 0 15px rgba(255,255,255,0.6));
            transform: translate(20%, -60%);
          }

          /* GREECE WAVING COLUMNS */
          .greece-waving-container {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
          }

          .flag-column {
            flex-grow: 1;
            height: 100%;
            animation: waving 1.5s ease-in-out infinite alternate;
            background: repeating-linear-gradient(
              to bottom,
              var(--flag-blue) 0px, var(--flag-blue) 48.8px,
              var(--flag-white) 48.8px, var(--flag-white) 97.6px
            );
            position: relative;
          }

          /* Greece Canton Logic for first 4 columns */
          .flag-column.with-canton::before {
            content: '';
            position: absolute;
            left: 0; top: 0; width: 100%; height: 55.5%;
            background: var(--flag-blue);
          }

          /* Cross pieces for columns 2 and 3 */
          .flag-column.with-cross-v::after {
            content: '';
            position: absolute;
            left: 20%; top: 0; width: 60%; height: 55.5%;
            background: var(--flag-white);
          }

          /* Cross horizontal for columns 1-4 at midpoint of canton */
          .flag-column.with-canton .cross-h {
            position: absolute;
            left: 0; top: 22.2%; width: 100%; height: 11.1%;
            background: var(--flag-white);
            z-index: 10;
          }

          .flag-column:nth-child(1) { animation-delay: 0.0s; }
          .flag-column:nth-child(2) { animation-delay: 0.1s; }
          .flag-column:nth-child(3) { animation-delay: 0.2s; }
          .flag-column:nth-child(4) { animation-delay: 0.3s; }
          .flag-column:nth-child(5) { animation-delay: 0.4s; }
          .flag-column:nth-child(6) { animation-delay: 0.5s; }
          .flag-column:nth-child(7) { animation-delay: 0.6s; }
          .flag-column:nth-child(8) { animation-delay: 0.7s; }
          .flag-column:nth-child(9) { animation-delay: 0.8s; }
        `}
      </style>

      <div 
        className={`relative rounded-[4rem] overflow-hidden transition-all duration-700 min-h-[440px] flex flex-col items-center justify-between p-10 border-2 
          ${fileState.file ? 'scale-[1.02] border-[#E1AD01] shadow-[0_0_100px_rgba(225,173,1,0.3)]' : 'hover:scale-[1.01] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]'} bg-black group/box`}
      >
        {/* RECONSTRUCTED FLAG BACKGROUND */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {isPakistan ? (
            <div className="elegant-flag-container">
               <div className="pk-wave">
                  <div className="white-bar"></div>
                  <div className="green-field">
                    <div className="crescent-star-wrapper">
                      <span className="crescent-symbol">🌙</span>
                      <span className="star-symbol">⭐</span>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="elegant-flag-container">
               <div className="greece-waving-container">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flag-column ${i < 4 ? 'with-canton' : ''} ${i === 1 || i === 2 ? 'with-cross-v' : ''}`}
                    >
                      {i < 4 && <div className="cross-h"></div>}
                    </div>
                  ))}
               </div>
            </div>
          )}
          
          {/* Subtle Elegance Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)]"></div>
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        {/* TOP: COMPACT ICON */}
        <div className="relative z-10">
          <div className={`w-24 h-24 rounded-full border border-white/20 bg-black/80 backdrop-blur-3xl flex items-center justify-center transition-all duration-500 group-hover/box:border-[#E1AD01] group-hover/box:scale-105 shadow-2xl`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${isPakistan ? 'text-green-400' : 'text-blue-400'} drop-shadow-[0_0_20px_currentColor]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* CENTER: TITLES */}
        <div className="relative z-10 text-center w-full">
          <h2 className="text-6xl font-[1000] text-white uppercase tracking-tighter drop-shadow-[0_15px_30px_rgba(0,0,0,1)] mb-2 transition-all duration-500 group-hover/box:tracking-normal">
            {isPakistan ? 'PASSPORT' : 'WORK PERMIT'}
          </h2>
          
          <div className="flex items-center justify-center gap-6 mt-6">
             <div className="h-[2px] w-12 bg-[#E1AD01]/40"></div>
             <span className="text-[12px] font-black text-[#E1AD01] uppercase tracking-[0.6em] drop-shadow-[0_0_20px_#E1AD01]">SOURCE</span>
             <div className="h-[2px] w-12 bg-[#E1AD01]/40"></div>
          </div>
        </div>

        {/* COMPACT DATA PREVIEW */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[140px] w-full px-8">
          {fileState.preview ? (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center w-full">
              <div className="relative mb-6">
                 <img 
                   src={fileState.preview} 
                   className="h-36 w-full object-contain rounded-2xl border-2 border-white/40 shadow-2xl transition-all duration-500 group-hover/box:scale-105" 
                 />
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); onFileSelect(null); }}
                className="text-[11px] font-black text-rose-500 uppercase tracking-widest bg-black/80 px-10 py-3 rounded-full border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-95"
              >
                REMOVE
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <p className="text-white/80 font-black text-xl uppercase tracking-[0.2em]">READY FOR FEED</p>
              <div className="flex justify-center gap-6 opacity-40">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-[#E1AD01] animate-pulse [animation-delay:-0.2s]"></div>
                <div className="w-3 h-3 rounded-full bg-white animate-pulse [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM: IDENTITY TAB */}
        <div className="relative z-10 w-full flex justify-center mt-6">
          <div className="bg-black/90 border border-white/10 rounded-full px-12 py-5 flex items-center gap-6 shadow-2xl backdrop-blur-xl">
            <div className={`w-4 h-4 rounded-full animate-ping ${isPakistan ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <span className="text-[18px] font-black text-white/90 tracking-[0.4em] uppercase">
              {isPakistan ? 'PK-110' : 'GR-110'}
            </span>
          </div>
        </div>

        <input 
          id={id}
          type="file" 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FileUploader;
