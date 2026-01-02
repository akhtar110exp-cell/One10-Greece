
import React, { useState, useMemo } from 'react';

const ManualConverter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const extractValue = (key: string, text: string) => {
    const patterns = [
      new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, 'i'),
      new RegExp(`"${key}"\\s*:\\s*([^\\n,}]*)`, 'i'),
      new RegExp(`${key}\\s*[:=]\\s*"([^"]*)"`, 'i'),
      new RegExp(`${key}\\s*[:=]\\s*([^\\n,}]*)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
    return "";
  };

  const scriptResult = useMemo(() => {
    if (!inputText.trim()) return '// Ready for manual input...';

    const fields = [
      'phone', 'mobile', 'fullName', 'greekDecisionNumber', 'employerName',
      'regionOfEmployment', 'am', 'apofasiYear', 'apofasiNumber',
      'greekEmployerName', 'passportNumber', 'expirationDate'
    ];

    const data: Record<string, string> = {};
    fields.forEach(field => {
      data[field] = extractValue(field, inputText);
    });

    return `const CLIENT_DATA = {
    phone: "${data.phone}",
    mobile: "${data.mobile}",
    fullName: "${data.fullName}",
    greekDecisionNumber: "${data.greekDecisionNumber}",
    employerName: "${data.employerName}",
    regionOfEmployment: "${data.regionOfEmployment}",
    am: "${data.am}",
    apofasiYear: "${data.apofasiYear}",
    apofasiNumber: "${data.apofasiNumber}",
    greekEmployerName: "${data.greekEmployerName}",
    passportNumber: "${data.passportNumber}",
    expirationDate: "${data.expirationDate}"
};`;
  }, [inputText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-24 mb-12">
      <style>
        {`
          @keyframes border-rotate-converter {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .dual-border-flow-converter {
            position: absolute;
            inset: -4px;
            background: conic-gradient(
              from 0deg,
              #006600 0deg,
              #ffffff 45deg,
              #001489 90deg,
              #ffffff 135deg,
              #006600 180deg,
              #ffffff 225deg,
              #001489 270deg,
              #ffffff 315deg,
              #006600 360deg
            );
            animation: border-rotate-converter 6s linear infinite;
            border-radius: 4rem;
            z-index: 0;
          }

          .source-textarea {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            resize: none;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: white;
            line-height: 1.6;
          }

          .source-textarea::placeholder {
            color: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-[#E1AD01] text-black rounded-lg text-[9px] font-black uppercase tracking-[0.3em] mb-4">RE-FORMATTING UTILITY</div>
        <h3 className="text-5xl font-[1000] text-white tracking-tighter uppercase mb-4">MASTER <span className="text-[#E1AD01]">CONVERTER</span></h3>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Generate valid scripts from raw text</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Input Box - Standard Dark Style Restored */}
        <div className="relative p-[2px] rounded-[4rem] overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]">
          <div className="dual-border-flow-converter"></div>
          <div className="relative z-10 h-full bg-[#1A1A1A] rounded-[4rem] p-12 flex flex-col group-hover:bg-[#1A1A1A]/95 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E1AD01]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SOURCE DATA</span>
              </div>
            </div>
            
            <div className="flex-grow bg-black rounded-[2.5rem] p-10 border border-white/10 shadow-inner overflow-hidden">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste raw data or JSON string here..."
                className="source-textarea custom-scrollbar"
              />
            </div>
          </div>
        </div>

        {/* Output Box */}
        <div className="relative p-[2px] rounded-[4rem] overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]">
          <div className="dual-border-flow-converter" style={{ animationDirection: 'reverse' }}></div>
          <div className="relative z-10 h-full bg-[#0f172a] rounded-[4rem] p-12 flex flex-col group-hover:bg-[#0f172a]/95 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E1AD01]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">NORMALIZED SCRIPT</span>
              </div>
              <button 
                onClick={handleCopy}
                disabled={!inputText.trim()}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-[#E1AD01] text-black' : 'bg-white/10 text-white hover:bg-[#E1AD01] hover:text-black disabled:opacity-20'}`}
              >
                {copied ? '✓ COPIED' : 'COPY SCRIPT'}
              </button>
            </div>

            <div className="flex-grow bg-black rounded-[2.5rem] p-10 border border-white/10 overflow-auto custom-scrollbar shadow-inner">
              <pre className="text-[#E1AD01] font-mono text-sm leading-[1.8] whitespace-pre selection:bg-white/10">
                {scriptResult}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManualConverter;
