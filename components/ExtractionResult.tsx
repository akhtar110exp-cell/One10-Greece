import React, { useState, useEffect, useRef } from 'react';
import { ClientData } from '../types';
import { REGION_LIST } from '../constants';

interface ExtractionResultProps {
  data: ClientData;
  onDataChange?: (newData: ClientData) => void;
  authLevel: 'admin' | 'client' | null;
}

const ExtractionResult: React.FC<ExtractionResultProps> = ({ data, onDataChange, authLevel }) => {
  const [editableData, setEditableData] = useState<ClientData>(data);
  const [agentName, setAgentName] = useState('');
  const [copiedClean, setCopiedClean] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportingPNG, setExportingPNG] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const slipRef = useRef<HTMLDivElement>(null);

  const isAdmin = authLevel === 'admin';

  useEffect(() => {
    setEditableData(data);
    const rand = () => Math.floor(1000 + Math.random() * 9000);
    setSerialNumber(`OX-${rand()}-${rand()}-${rand()}`);
    
    const now = new Date();
    setCurrentDateTime(now.toLocaleDateString() + ' | ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [data]);

  const getCleanScript = () => {
    if (!isAdmin) return null;
    return `const CLIENT_DATA = {
    phone: "${editableData.phone}",
    mobile: "${editableData.mobile}",
    fullName: "${editableData.fullName}",
    greekDecisionNumber: "${editableData.greekDecisionNumber}",
    employerName: "${editableData.employerName}",
    regionOfEmployment: "${editableData.regionOfEmployment}",
    am: "${editableData.am}",
    apofasiYear: "${editableData.apofasiYear}",
    apofasiNumber: "${editableData.apofasiNumber}",
    greekEmployerName: "${editableData.greekEmployerName}",
    passportNumber: "${editableData.passportNumber}",
    expirationDate: "${editableData.expirationDate}"
};`;
  };

  const copyToClipboard = () => {
    const script = getCleanScript();
    if (script) {
      setCopiedClean(true);
      navigator.clipboard.writeText(script);
      setTimeout(() => setCopiedClean(false), 2000);
    }
  };

  const handleDownloadJS = () => {
    const script = getCleanScript();
    if (!script) return;
    setDownloading(true);
    const blob = new Blob([script], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CLIENT_DATA_${editableData.fullName.replace(/\s+/g, '_')}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(false), 1000);
  };

  const downloadValidationSlip = async () => {
    if (!agentName.trim()) {
      alert("Error: Please enter the Agent Name before generating the slip.");
      return;
    }

    if (!slipRef.current) return;
    setExportingPNG(true);
    try {
      // @ts-ignore
      const canvas = await html2canvas(slipRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Validation_Slip_${editableData.fullName.replace(/\s+/g, '_')}_${agentName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG Export Error:", err);
    } finally {
      setExportingPNG(false);
    }
  };

  const updateField = (field: keyof ClientData, value: string) => {
    const newData = { ...editableData, [field]: value };
    setEditableData(newData);
    if (onDataChange) onDataChange(newData);
  };

  const pkFlagTheme = "https://img.freepik.com/premium-photo/pakistan-flag-crumpled-paper-background_644690-366.jpg";
  const grFlagTheme = "https://t3.ftcdn.net/jpg/00/60/32/30/360_F_60323055_67fO95g7T8YVfK69WvI3j3yF6y6l69Pj.jpg";

  return (
    <div className="space-y-20">
      <style>
        {`
          @keyframes sync-flag-animate {
            0% { transform: scale(1.1) rotate(0deg) translate(-1%, -1%); }
            50% { transform: scale(1.2) rotate(0.5deg) translate(1%, 1%); }
            100% { transform: scale(1.1) rotate(0deg) translate(-1%, -1%); }
          }
          .sync-flag-pk {
            position: absolute; left: 0; top: 0; bottom: 0; width: 60%;
            background-image: url("${pkFlagTheme}");
            background-size: cover;
            background-position: center;
            filter: saturate(1.5) brightness(0.2);
            animation: sync-flag-animate 25s ease-in-out infinite;
          }
          .sync-flag-gr {
            position: absolute; right: 0; top: 0; bottom: 0; width: 60%;
            background-image: url("${grFlagTheme}");
            background-size: cover;
            background-position: center;
            filter: saturate(1.5) brightness(0.25);
            animation: sync-flag-animate 25s ease-in-out infinite reverse;
          }

          /* A4 SLIP STYLING FOR EXPORT */
          .a4-container {
            width: 210mm; 
            height: 297mm; 
            padding: 12mm; 
            background: white; 
            position: absolute; 
            left: -9999px; 
            top: -9999px;
            box-sizing: border-box;
            color: black; 
            overflow: hidden;
          }

          .slip-watermark {
            position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%);
            width: 85%; opacity: 0.06; z-index: 0; pointer-events: none;
          }

          .slip-top-meta { 
            display: flex; 
            justify-content: space-between; 
            font-size: 9pt; 
            font-weight: bold; 
            margin-bottom: 10px; 
            position: relative; 
            z-index: 1;
          }

          .slip-header { text-align: center; border-bottom: 3px solid #f89d21; margin-bottom: 25px; padding-bottom: 10px; position: relative; z-index: 1; }
          .slip-header img { width: 140px; margin: 0 auto; }
          .slip-header h2 { margin: 5px 0; font-size: 24pt; font-weight: 900; color: #1a1a1a; }

          .slip-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; position: relative; z-index: 1; }
          .slip-box { border: 1.5px solid #333; border-radius: 12px; padding: 10px; text-align: center; background: white; }
          .slip-label { display: block; font-size: 7.5pt; color: #f89d21; font-weight: bold; text-transform: uppercase; }
          .slip-value { font-size: 10.5pt; font-weight: bold; color: black; }

          .slip-agent-box { border: 2px solid #f89d21; background: #fff9f0; }

          .slip-stamp {
            position: absolute; top: 65%; right: 8%; border: 6px double #28a745;
            color: #28a745; padding: 12px 25px; font-size: 24pt; font-weight: 900;
            transform: rotate(-15deg); z-index: 5; background: white; border-radius: 10px;
          }

          .slip-footer { position: absolute; bottom: 12mm; width: 186mm; display: flex; justify-content: space-between; align-items: flex-end; }
          .slip-serial-box { font-family: monospace; font-size: 13pt; font-weight: bold; text-align: right; }
        `}
      </style>

      {/* HIDDEN CAPTURE AREA FOR HTML2CANVAS */}
      <div ref={slipRef} className="a4-container">
        <img src="logo.jpeg" className="slip-watermark" alt="watermark" />
        
        <div className="slip-top-meta">
            <div>{currentDateTime}</div>
            <div style={{ textAlign: 'right', borderRight: '3px solid #f89d21', paddingRight: '10px' }}>
                CLIENT: {editableData.fullName}<br />
                MOB: {editableData.mobile}
            </div>
        </div>

        <div className="slip-header">
            <img src="logo.jpeg" alt="ONE10 EXPRESS" />
            <h2>IDENTITY VALIDATION SUMMARY</h2>
        </div>

        <div className="slip-grid">
            <div className="slip-box"><span className="slip-label">Full Name</span><div className="slip-value">{editableData.fullName}</div></div>
            <div className="slip-box"><span className="slip-label">Phone</span><div className="slip-value">{editableData.phone}</div></div>
            <div className="slip-box"><span className="slip-label">Mobile</span><div className="slip-value">{editableData.mobile}</div></div>
            
            <div className="slip-box"><span className="slip-label">Greek Decision No.</span><div className="slip-value">{editableData.greekDecisionNumber}</div></div>
            <div className="slip-box"><span className="slip-label">Employer Name</span><div className="slip-value">{editableData.employerName}</div></div>
            
            <div className="slip-box slip-agent-box">
                <span className="slip-label">AGENT NAME</span>
                <div className="slip-value" style={{ color: agentName ? 'black' : '#d32f2f' }}>
                  {agentName.toUpperCase() || 'REQUIRED*'}
                </div>
            </div>

            <div className="slip-box"><span className="slip-label">AM</span><div className="slip-value">{editableData.am}</div></div>
            <div className="slip-box"><span className="slip-label">Apofasi Year</span><div className="slip-value">{editableData.apofasiYear}</div></div>
            <div className="slip-box"><span className="slip-label">Apofasi Number</span><div className="slip-value">{editableData.apofasiNumber}</div></div>

            <div className="slip-box"><span className="slip-label">Passport Number</span><div className="slip-value">{editableData.passportNumber}</div></div>
            <div className="slip-box"><span className="slip-label">Expiration Date</span><div className="slip-value">{editableData.expirationDate}</div></div>
            <div className="slip-box"><span className="slip-label">Region</span><div className="slip-value">{editableData.regionOfEmployment}</div></div>
        </div>

        <div className="slip-stamp">READY TO PROCEED</div>

        <div className="slip-footer">
            <div style={{ fontSize: '8pt', color: '#555' }}>© 2026 ONE10 EXPRESS PORTAL</div>
            <div className="slip-serial-box">
                <span style={{ fontSize: '8pt', color: '#f89d21' }}>SERIAL NO:</span><br />
                <span>{serialNumber}</span>
            </div>
        </div>
      </div>

      <section className="relative">
        <div className={`relative bg-[#0A0A0A] rounded-[4rem] overflow-hidden border transition-all duration-500 shadow-[0_50px_100px_rgba(0,0,0,1)] ${isAdmin ? 'border-[#E1AD01]/40' : 'border-rose-500/10 grayscale'}`}>
          <div className="px-14 py-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] relative z-30 backdrop-blur-md gap-6">
            <div className="flex items-center gap-8">
              <div className={`w-6 h-6 rounded-full ${isAdmin ? 'bg-[#E1AD01] shadow-[0_0_20px_#E1AD01]' : 'bg-rose-500'} animate-pulse`}></div>
              <div>
                <h4 className="text-white font-black text-2xl tracking-[0.2em] uppercase">MASTER SYNC BLOCK</h4>
                {!isAdmin && <span className="text-rose-500 text-[11px] font-black uppercase tracking-[0.4em]">[RESTRICTED]</span>}
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <input 
                  type="text" 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="AGENT NAME REQUIRED*"
                  className="px-8 py-4 bg-black/50 border-2 border-[#f89d21]/30 rounded-2xl font-black text-white text-xs tracking-widest uppercase outline-none focus:border-[#f89d21] transition-all min-w-[250px] text-center"
                />
                <button 
                  onClick={downloadValidationSlip} 
                  disabled={exportingPNG}
                  className="px-8 py-4 bg-[#28a745] text-white rounded-2xl font-black text-[11px] tracking-widest uppercase hover:bg-[#218838] transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(40,167,69,0.3)]"
                >
                  {exportingPNG ? 'PROCESSING...' : 'DOWNLOAD SLIP (PNG)'}
                </button>
                <div className="flex gap-4">
                  <button onClick={handleDownloadJS} className="px-6 py-4 bg-white/5 text-[#E1AD01] border border-[#E1AD01]/30 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#E1AD01] hover:text-black transition-all">
                    {downloading ? 'SAVING...' : 'SAVE JS'}
                  </button>
                  <button onClick={copyToClipboard} className="px-8 py-4 bg-[#E1AD01] text-black rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-white transition-all">
                    {copiedClean ? '✓ COPIED' : 'COPY CODE'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-16 overflow-x-auto bg-black relative min-h-[600px] flex flex-col items-center justify-center">
            {isAdmin ? (
              <>
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <div className="sync-flag-pk"></div>
                  <div className="sync-flag-gr"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                </div>

                <pre className="text-[#E1AD01] font-mono text-xl md:text-2xl leading-relaxed relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,1)] bg-black/40 p-8 rounded-3xl border border-white/5 mt-8 backdrop-blur-sm">
                  {getCleanScript()}
                </pre>
              </>
            ) : (
              <div className="text-center space-y-6">
                <p className="text-white font-[1000] text-3xl uppercase tracking-tighter">ACCESS DENIED</p>
                <p className="text-slate-500 text-sm font-black uppercase tracking-[0.4em]">ADMIN RANK REQUIRED</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#111] rounded-[5rem] p-20 border border-white/5 shadow-2xl relative group/results">
        <div className="mb-16 border-l-[12px] border-[#E1AD01] pl-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div>
              <h3 className="text-5xl font-[1000] text-white uppercase tracking-tighter">Identity Validation</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.6em] mt-3">TIER: {isAdmin ? 'MASTER_ADMIN' : 'AGENT_VERIFY'}</p>
           </div>
           {isAdmin && (
              <div className="flex flex-col items-center gap-4">
                 <input 
                    type="text" 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="ENTER AGENT NAME"
                    className="px-8 py-5 bg-black border-2 border-white/10 rounded-[2rem] font-black text-white text-xs tracking-widest uppercase outline-none focus:border-[#f89d21] transition-all min-w-[300px] text-center"
                 />
                 <button 
                    onClick={downloadValidationSlip} 
                    className="px-10 py-5 bg-[#28a745]/10 text-[#28a745] border-2 border-[#28a745]/40 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-[#28a745] hover:text-white transition-all shadow-xl"
                 >
                    GENERATE OFFICIAL SLIP
                 </button>
              </div>
           )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.keys(editableData).map((key) => {
            if (key === 'rawText') return null;
            const isRegion = key === 'regionOfEmployment';
            return (
              <div key={key} className="space-y-4">
                <label className="text-[11px] font-black text-[#E1AD01] uppercase tracking-[0.4em] ml-6">{key.replace(/([A-Z])/g, ' $1')}</label>
                {isRegion ? (
                  <select value={(editableData as any)[key]} onChange={(e) => updateField(key as keyof ClientData, e.target.value)} className="w-full px-10 py-6 bg-black border-2 border-white/5 rounded-[2.5rem] font-black text-white outline-none focus:border-[#E1AD01] transition-all cursor-pointer appearance-none">
                    {REGION_LIST.map(r => <option key={r} value={r} className="bg-[#111]">{r}</option>)}
                  </select>
                ) : (
                  <input type="text" value={(editableData as any)[key]} onChange={(e) => updateField(key as keyof ClientData, e.target.value)} className="w-full px-10 py-6 bg-black border-2 border-white/5 rounded-[2.5rem] font-black text-white outline-none focus:border-[#E1AD01] transition-all" />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ExtractionResult;