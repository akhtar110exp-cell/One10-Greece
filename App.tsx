
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ExtractionResult from './components/ExtractionResult';
import ManualConverter from './components/ManualConverter';
import LoginScreen from './components/LoginScreen';
import ExtractionOverlay from './components/ExtractionOverlay';
import { extractDocumentDetails } from './services/geminiService';
import { ClientData, FileState } from './types';

const STORAGE_KEY_BRANDING = 'one10_branding_image';
const STORAGE_KEY_VISITS = 'one10_portal_visits';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'portal'>('login');
  const [authLevel, setAuthLevel] = useState<'admin' | 'client' | null>('admin');
  
  const [passport, setPassport] = useState<FileState>({ file: null, preview: null, name: 'Passport' });
  const [apofasi, setApofasi] = useState<FileState>({ file: null, preview: null, name: 'Work Permit' });
  const [manualPhone, setManualPhone] = useState('');
  const [manualMobile, setManualMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visitCount, setVisitCount] = useState(0);
  
  const [brandingImage, setBrandingImage] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY_BRANDING));
  const brandingInputRef = useRef<HTMLInputElement>(null);

  const pkFlagImg = "https://img.freepik.com/premium-photo/pakistan-flag-crumpled-paper-background_644690-366.jpg";
  const grFlagImg = "https://t3.ftcdn.net/jpg/00/60/32/30/360_F_60323055_67fO95g7T8YVfK69WvI3j3yF6y6l69Pj.jpg";

  useEffect(() => {
    const storedVisits = parseInt(localStorage.getItem(STORAGE_KEY_VISITS) || '0', 10);
    const newCount = storedVisits + 1;
    localStorage.setItem(STORAGE_KEY_VISITS, newCount.toString());
    setVisitCount(newCount);
  }, []);

  const handlePassportSelect = useCallback((file: File | null) => {
    setPassport({ file, preview: file ? URL.createObjectURL(file) : null, name: 'Passport' });
    setError(null);
  }, []);

  const handleApofasiSelect = useCallback((file: File | null) => {
    setApofasi({ file, preview: file ? URL.createObjectURL(file) : null, name: 'Work Permit' });
    setError(null);
  }, []);

  const handleExtract = async () => {
    setError(null);
    const filesToExtract = [passport.file, apofasi.file].filter(Boolean) as File[];
    if (filesToExtract.length === 0) return setError("SOURCE DOCUMENTS REQUIRED.");
    if (!manualPhone.trim() || !manualMobile.trim()) {
      setError("CONTACT NUMBERS ARE MANDATORY.");
      return;
    }
    setLoading(true);
    
    // Ensure the overlay displays for at least 7.5 seconds to accommodate both audio messages
    const minExtractionTime = new Promise(resolve => setTimeout(resolve, 7500));
    
    try {
      const extractionPromise = extractDocumentDetails(filesToExtract);
      const [data] = await Promise.all([extractionPromise, minExtractionTime]);
      setResult({ ...data, phone: manualPhone, mobile: manualMobile });
    } catch (err: any) {
      setError(err.message || "Extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (authLevel !== 'admin') return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBrandingImage(base64String);
        localStorage.setItem(STORAGE_KEY_BRANDING, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const isButtonDisabled = loading || (!passport.file && !apofasi.file);

  if (view === 'login') {
    return <LoginScreen onStart={() => setView('portal')} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#020202] text-white overflow-x-hidden font-sans animate-in fade-in duration-1000">
      <style>
        {`
          @keyframes energy-shimmer {
            0% { transform: translateX(-150%) skewX(-15deg); }
            100% { transform: translateX(250%) skewX(-15deg); }
          }
          @keyframes drift-slow {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(3%, 3%) scale(1.05); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes global-wallpaper-breathe {
            0% { transform: scale(1.0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1.0); }
          }
          @keyframes btn-billow-pk {
            0% { transform: translate(-50%, -50%) scale(1.5) translate(-2%, -2%); }
            50% { transform: translate(-50%, -50%) scale(1.6) translate(2%, 2%); }
            100% { transform: translate(-50%, -50%) scale(1.5) translate(-2%, -2%); }
          }
          @keyframes btn-billow-gr {
            0% { transform: translate(-50%, -50%) scale(1.5) translate(2%, 2%); }
            50% { transform: translate(-50%, -50%) scale(1.6) translate(-2%, -2%); }
            100% { transform: translate(-50%, -50%) scale(1.5) translate(2%, 2%); }
          }
          
          @keyframes contact-wave {
            0% { transform: perspective(800px) rotateX(15deg) translateY(0px) scale(1.2); }
            100% { transform: perspective(800px) rotateX(-15deg) translateY(20px) scale(1.3); }
          }

          .contact-flag-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 100px;
            position: absolute;
            inset: -20%;
            z-index: 0;
            opacity: 0.15;
            pointer-events: none;
          }

          .contact-flag {
            width: 500px;
            height: 333px;
            box-shadow: 0 50px 100px rgba(0,0,0,0.8);
            animation: contact-wave 5s ease-in-out infinite alternate;
            position: relative;
            background-size: cover;
          }

          .contact-pakistan {
            background-color: #006600;
            position: relative;
            overflow: hidden;
          }
          .contact-pakistan::before {
            content: '★ 🌙';
            color: white;
            font-size: 140px;
            position: absolute;
            top: 50%;
            left: 40%;
            transform: translate(-50%, -50%);
          }
          .contact-pakistan::after {
            content: '';
            position: absolute;
            width: 125px;
            height: 100%;
            background: white;
            left: 0;
          }

          .contact-greece {
            background: linear-gradient(
              #005baa 0%, #005baa 18%, 
              white 18%, white 36%, 
              #005baa 36%, #005baa 54%, 
              white 54%, white 72%, 
              #005baa 72%, #005baa 90%, 
              white 90%, white 100%
            );
            animation-delay: -2.5s;
          }
          .contact-greece::before {
            content: '';
            position: absolute;
            width: 160px;
            height: 160px;
            background-color: #005baa;
            top: 0;
            left: 0;
            background-image: linear-gradient(white, white), linear-gradient(white, white);
            background-size: 160px 32px, 32px 160px;
            background-position: center, center;
            background-repeat: no-repeat;
          }

          .dual-flag-button {
            position: relative;
            background: #000;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.4);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 40px rgba(225, 173, 1, 0.2);
          }
          .dual-flag-button:hover {
            border-color: #E1AD01;
            box-shadow: 0 0 80px rgba(225, 173, 1, 0.4);
          }
          .btn-flag-pk-layer {
            position: absolute;
            left: 0; top: 0; bottom: 0; width: 55%;
            background-image: url("${pkFlagImg}");
            background-size: cover;
            background-position: center;
            filter: saturate(2.5) contrast(1.4) brightness(0.6);
            clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
            animation: btn-billow-pk 10s ease-in-out infinite;
          }
          .btn-flag-gr-layer {
            position: absolute;
            right: 0; top: 0; bottom: 0; width: 55%;
            background-image: url("${grFlagImg}");
            background-size: cover;
            background-position: center;
            filter: saturate(2.5) contrast(1.4) brightness(0.7);
            clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
            animation: btn-billow-gr 12s ease-in-out infinite reverse;
          }
          .btn-energy-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: energy-shimmer 3s infinite;
            z-index: 5;
            pointer-events: none;
          }
          .global-wallpaper-pk {
            position: absolute; left: 0; top: 0; bottom: 0; width: 60%;
            background-image: url("${pkFlagImg}");
            background-size: cover;
            background-position: center;
            opacity: 0.08;
            filter: saturate(1.5) contrast(1.5) brightness(0.4);
            mask-image: linear-gradient(to right, black 40%, transparent 100%);
          }
          .global-wallpaper-gr {
            position: absolute; right: 0; top: 0; bottom: 0; width: 60%;
            background-image: url("${grFlagImg}");
            background-size: cover;
            background-position: center;
            opacity: 0.08;
            filter: saturate(1.5) contrast(1.5) brightness(0.5);
            mask-image: linear-gradient(to left, black 40%, transparent 100%);
          }

          .husayn-sharp {
            color: #ffffff;
            font-family: 'Amiri', serif;
            font-size: 4rem;
            text-align: center;
            direction: rtl;
            margin: 40px 0;
            font-weight: bold;
            -webkit-text-stroke: 2px #ff0000;
            text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.2);
            animation: shineEffect 3s linear infinite;
            user-select: none;
          }

          @keyframes shineEffect {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
          }
        `}
      </style>

      {/* High-tech Extraction Overlay */}
      <ExtractionOverlay isVisible={loading} />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 animate-[global-wallpaper-breathe_30s_ease-in-out_infinite]">
          <div className="global-wallpaper-pk"></div>
          <div className="global-wallpaper-gr"></div>
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/40 rounded-full blur-[160px] animate-[drift-slow_15s_infinite_alternate]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/40 rounded-full blur-[160px] animate-[drift-slow_18s_infinite_alternate-reverse]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <div className="flex flex-col items-center mb-12 scale-125 transform">
             <div className="flex items-baseline gap-2">
                <span className="text-7xl font-[1000] text-white tracking-tighter text-shadow-lg">ONE</span>
                <span className="text-7xl font-[1000] text-[#E1AD01] tracking-tighter drop-shadow-[0_0_20px_rgba(225,173,1,0.5)]">1</span>
                <span className="text-7xl font-[1000] text-white tracking-tighter text-shadow-lg">0</span>
             </div>
             <div className="flex items-center w-full gap-4 -mt-2 opacity-60">
                <div className="h-[2px] flex-grow bg-white/20"></div>
                <div className="text-2xl font-black uppercase tracking-[0.4em] italic text-white/80">
                  <span className="text-[#E1AD01]">EX</span>press
                </div>
                <div className="h-[2px] flex-grow bg-white/20"></div>
             </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8 ml-10">
            <div className="w-2 h-7 rounded-full bg-white shadow-[0_0_20px_white]"></div>
            <label className="text-[14px] font-[1000] uppercase tracking-[0.8em] text-white/70">
              CLIENT CONTACT INFO
            </label>
          </div>
          
          <div className="bg-[#0A0A0A] rounded-[4.5rem] p-16 shadow-[0_50px_120px_rgba(0,0,0,1)] relative overflow-hidden border border-white/10 group/contact">
            <div className="contact-flag-container">
              <div className="contact-flag contact-pakistan"></div>
              <div className="contact-flag contact-greece"></div>
            </div>

            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.95)]"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#E1AD01] uppercase tracking-[0.5em] ml-8 drop-shadow-md">AUTHORIZED PHONE</label>
                <input type="tel" value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} placeholder="+92 ..." className="w-full px-12 py-8 bg-black/70 backdrop-blur-xl border border-white/20 rounded-[3rem] outline-none text-white font-[1000] text-2xl focus:border-[#E1AD01] focus:ring-4 focus:ring-[#E1AD01]/10 transition-all shadow-2xl" />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#E1AD01] uppercase tracking-[0.5em] ml-8 drop-shadow-md">AGENT MOBILE</label>
                <input type="tel" value={manualMobile} onChange={(e) => setManualMobile(e.target.value)} placeholder="+30 ..." className="w-full px-12 py-8 bg-black/70 backdrop-blur-xl border border-white/20 rounded-[3rem] outline-none text-white font-[1000] text-2xl focus:border-[#E1AD01] focus:ring-4 focus:ring-[#E1AD01]/10 transition-all shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <FileUploader label="PASSPORT SOURCE" id="passport" fileState={passport} onFileSelect={handlePassportSelect} variant="pakistan" />
          <FileUploader label="WORK PERMIT SOURCE" id="apofasi" fileState={apofasi} onFileSelect={handleApofasiSelect} variant="greece" />
        </div>

        <div className="flex justify-center mb-28">
          <button 
            onClick={handleExtract} 
            disabled={isButtonDisabled} 
            className={`group relative px-28 py-16 rounded-[4rem] font-[1000] text-4xl transition-all shadow-2xl flex items-center justify-center gap-10 overflow-hidden ${isButtonDisabled ? 'opacity-30 bg-[#111] text-white/50 cursor-not-allowed' : 'dual-flag-button hover:scale-[1.05] text-white'}`}
          >
            {!isButtonDisabled && (
              <>
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <div className="btn-flag-pk-layer"></div>
                  <div className="btn-flag-gr-layer"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
                </div>
                <div className="btn-energy-overlay"></div>
              </>
            )}
            <span className="relative z-10 uppercase tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              {loading ? "EXTRACTING..." : "ONE10 SCAN NOW"}
            </span>
            {!loading && !isButtonDisabled && (
               <div className="relative z-10 w-10 h-10 border-4 border-white/20 rounded-full border-t-[#E1AD01] animate-spin opacity-40"></div>
            )}
          </button>
        </div>

        {error && (
            <div className="mb-20 p-14 bg-rose-950/40 border-2 border-rose-500 rounded-[4.5rem] text-center animate-in fade-in zoom-in-95">
                <h5 className="text-rose-500 font-black text-2xl mb-2 uppercase tracking-tight">ERROR</h5>
                <p className="text-white font-bold uppercase text-base">{error}</p>
            </div>
        )}

        {result && <ExtractionResult data={result} onDataChange={setResult} authLevel={authLevel} />}

        <ManualConverter />

        <div className="mt-32 p-32 bg-[#0A0A0A] rounded-[7rem] border border-white/10 flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div 
            className={`relative w-64 h-64 rounded-full border-[12px] mb-14 overflow-hidden shadow-2xl transition-all duration-700 ${authLevel === 'admin' ? 'cursor-pointer hover:scale-110 hover:border-[#E1AD01]' : 'opacity-60'} border-[#151515]`} 
            onClick={() => authLevel === 'admin' && brandingInputRef.current?.click()}
          >
            {brandingImage ? (
                <img src={brandingImage} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-[#111] flex items-center justify-center font-[1000] text-8xl text-white/5">110</div>
            )}
          </div>
          <input ref={brandingInputRef} type="file" accept="image/*" className="hidden" onChange={handleBrandingUpload} />
          <div className="text-center">
            <h2 className="text-6xl font-[1000] text-white tracking-tighter mb-4 uppercase">ONE10 GLOBAL VAULT</h2>
            <div className="flex items-center justify-center gap-6 text-white/20 font-black text-sm uppercase tracking-[0.5em]">
                <span>NODE V11.0</span>
                <span className="w-2 h-2 rounded-full bg-white/10"></span>
                <span>HITS: {(56000 + visitCount).toLocaleString()}</span>
            </div>
            
            <div className="husayn-sharp">
                بسمِ رَبِ الحُسینؑ
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
