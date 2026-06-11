"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Users, CheckCircle, XCircle, RefreshCw, Loader2, Lock, LogOut, Trash2, Trophy, Clock, Phone, Zap } from "lucide-react";


const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "0000";

type RosterItem = {
  name: string;
  email: string;
  phone?: string;
  proficiency?: string;
  duration?: string;
  shoes?: string;
  checkInTime: string | null;
  status: "Checked In" | "Pending";
};

export default function WeekendBaddieApp() {
  const [activeTab, setActiveTab] = useState<"scanner" | "dashboard">("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Check local storage for auth state on mount
    const authState = localStorage.getItem("wb_auth");
    if (authState === "true") {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wb_auth");
    setIsAuthenticated(false);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-indigo-100 relative overflow-hidden">
      
      {/* Soft Background Pattern Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/60 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/60 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-amber-50/60 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">WB</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
                The Weekend Baddie
              </h1>
            </div>
            
            <nav className="flex items-center gap-4">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "dashboard" 
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab("scanner")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "scanner" 
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Scanner</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                title="Lock App"
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === "scanner" ? <ScannerView /> : <DashboardView />}
      </main>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem("wb_auth", "true");
      onLogin();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-multiply pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-300 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Lock className="w-7 h-7 text-indigo-500" />
        </div>
        <h1 className="text-2xl font-black text-center text-slate-800 mb-2 tracking-tight">Admin Access</h1>
        <p className="text-center text-slate-500 mb-8 text-sm font-medium">
          Please enter your secure PIN to access the management portal.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full bg-white border ${
                error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10"
              } rounded-2xl px-4 py-4 text-center text-2xl font-mono text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 transition-all shadow-inner font-bold`}
              autoFocus
            />
            {error && (
              <p className="text-rose-500 text-sm font-semibold text-center mt-3 animate-in slide-in-from-top-1">
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-[0_8px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_25px_rgba(99,102,241,0.35)] hover:-translate-y-0.5"
          >
            Unlock App
          </button>
        </form>
      </div>
    </div>
  );
}

function ScannerView() {
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [playerInfo, setPlayerInfo] = useState<{phone?: string, proficiency?: string, duration?: string, shoes?: string} | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Initialize Scanner on mount
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    const startScanner = async () => {
      try {
        await scannerRef.current?.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          onScanSuccess,
          onScanFailure
        );
      } catch (err: any) {
        const errMsg = err?.toString() || "";
        if (errMsg.includes("already under transition")) {
          return;
        }
        console.error("Failed to start scanner", err);
        setScanStatus("error");
        setMessage("Camera access denied or unavailable.");
      }
    };

    startScanner();

    return () => {
      try {
        if (scannerRef.current?.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      } catch (e) {
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scanStatus === "scanning" || scanStatus === "success") return;
    
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.pause();
    }

    setScanStatus("scanning");
    setMessage("Processing ticket...");

    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrId: decodedText }),
      });

      const result = await response.json();

      if (result.success) {
        setScanStatus("success");
        setParticipantName(result.name || "Participant");
        setPlayerInfo({
          phone: result.phone,
          proficiency: result.proficiency,
          duration: result.duration,
          shoes: result.shoes
        });
        setMessage(result.message || "Check-in successful");
      } else {
        setScanStatus("error");
        setMessage(result.error || "Invalid ticket");
      }
    } catch (err) {
      setScanStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  const onScanFailure = (error: any) => {
    // Ignore frequent failed scans until a code is caught
  };

  const resumeScanning = async () => {
    setScanStatus("idle");
    setMessage("");
    setParticipantName("");
    setPlayerInfo(null);
    if (scannerRef.current?.getState() === 3) { // PAUSED
      await scannerRef.current.resume();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">QR Scanner</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Point camera at participant's digital ticket
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative">
          {/* Scanner view */}
          <div id="reader" className="w-full min-h-[300px] bg-slate-900"></div>

          {/* Overlay for status */}
          {scanStatus !== "idle" && (
            <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
              {scanStatus === "scanning" && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Verifying</h3>
                  <p className="text-slate-500 font-medium">{message}</p>
                </div>
              )}

              {scanStatus === "success" && (
                <div className="flex flex-col items-center text-center w-full max-w-sm">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">{participantName}</h3>
                  <p className="text-emerald-600 font-bold mb-6 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{message}</p>
                  
                  {playerInfo && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full mb-6 text-left grid grid-cols-2 gap-y-4 gap-x-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Phone className="w-3.5 h-3.5"/> <span className="text-xs font-bold uppercase tracking-wider">Phone</span></div>
                        <span className="text-slate-800 font-semibold">{playerInfo.phone || 'N/A'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Trophy className="w-3.5 h-3.5"/> <span className="text-xs font-bold uppercase tracking-wider">Skill</span></div>
                        <span className="text-slate-800 font-semibold">{playerInfo.proficiency || 'N/A'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Clock className="w-3.5 h-3.5"/> <span className="text-xs font-bold uppercase tracking-wider">Experience</span></div>
                        <span className="text-slate-800 font-semibold">{playerInfo.duration || 'N/A'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Zap className="w-3.5 h-3.5"/> <span className="text-xs font-bold uppercase tracking-wider">Shoes</span></div>
                        <span className="text-slate-800 font-semibold">{playerInfo.shoes || 'N/A'}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resumeScanning}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-2xl py-4 font-bold transition-all shadow-md"
                  >
                    Scan Next Ticket
                  </button>
                </div>
              )}

              {scanStatus === "error" && (
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
                    <XCircle className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Invalid Ticket</h3>
                  <p className="text-rose-600 font-bold mb-8 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">{message}</p>
                  
                  <button
                    onClick={resumeScanning}
                    className="mt-4 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-5 bg-slate-50 border-t border-slate-100 text-center rounded-b-[2.5rem]">
          <p className="text-sm font-medium text-slate-500">Position the QR code within the frame</p>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to permanently delete ALL players from the roster? This cannot be undone.")) return;
    
    setIsResetting(true);
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_PIN}`
        }
      });
      if (!response.ok) throw new Error('Failed to reset');
      
      await fetchRoster();
    } catch (err) {
      console.error(err);
      setError("Failed to clear the roster.");
    } finally {
      setIsResetting(false);
    }
  };

  const fetchRoster = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/roster');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setRoster(data);
    } catch (err) {
      console.error(err);
      setError("Could not load roster. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const checkedInCount = roster.filter(r => r.status === "Checked In").length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 mb-2">
          Welcome back, Admin 👋
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Here's what's happening with your roster today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
            <Users className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Registered</p>
            <p className="text-3xl font-black text-slate-800">{roster.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Checked In</p>
            <p className="text-3xl font-black text-slate-800">{checkedInCount}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={fetchRoster}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-2xl font-bold transition-all border border-slate-200 shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading && !isResetting ? "animate-spin text-indigo-500" : "text-slate-400"}`} />
            Refresh Roster
          </button>
          
          <button
            onClick={handleReset}
            disabled={loading || isResetting}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 disabled:opacity-50 rounded-2xl font-bold transition-all border border-rose-100 shadow-sm"
          >
            {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Clear Roster Data
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-[2rem] text-center shadow-sm">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <p className="text-rose-600 font-bold">{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-800">Live Roster</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Participant</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs hidden md:table-cell">Details</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs hidden sm:table-cell">Check-in Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && roster.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">Loading participants...</p>
                    </td>
                  </tr>
                ) : roster.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-500 font-medium">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-400" />
                      </div>
                      No participants registered yet.
                    </td>
                  </tr>
                ) : (
                  roster.map((person, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-800 text-base">{person.name}</div>
                        <div className="text-slate-500 text-xs font-medium mt-1">{person.email}</div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell text-xs text-slate-500 font-medium space-y-1.5">
                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400"/> <span className="text-slate-700">{person.phone || '-'}</span></div>
                        <div className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-400"/> <span className="text-slate-700">{person.proficiency || '-'}</span></div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-sky-400"/> <span className="text-slate-700">{person.duration || '-'}</span></div>
                        <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-400"/> <span className="text-slate-700">{person.shoes || '-'}</span></div>
                      </td>
                      <td className="px-6 py-5">
                        {person.status === "Checked In" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 hidden sm:table-cell text-slate-600 font-medium text-sm">
                        {person.checkInTime ? new Date(person.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
