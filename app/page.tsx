"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Users, CheckCircle, XCircle, RefreshCw, Loader2, Lock, LogOut, Trash2 } from "lucide-react";


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
  const [activeTab, setActiveTab] = useState<"scanner" | "dashboard">("scanner");
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center">
                <span className="text-neutral-950 font-bold text-sm">WB</span>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 drop-shadow-sm">
                The Weekend Baddy
              </h1>
            </div>
            
            <nav className="flex items-center gap-4">
              <div className="flex space-x-1 bg-neutral-800/50 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("scanner")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === "scanner" 
                      ? "bg-neutral-700 text-white shadow-sm" 
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Scanner</span>
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === "dashboard" 
                      ? "bg-neutral-700 text-white shadow-sm" 
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                title="Lock App"
                className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="w-12 h-12 rounded-full bg-neutral-800/50 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">Restricted Access</h1>
        <p className="text-center text-neutral-400 mb-8 text-sm">
          Please enter the organizer PIN to access the scanner and dashboard.
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
              placeholder="Enter PIN"
              className={`w-full bg-neutral-950 border ${
                error ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-emerald-500"
              } rounded-xl px-4 py-3 text-center text-xl font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 ${
                error ? "focus:ring-red-500" : "focus:ring-emerald-500"
              } transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center mt-2 animate-in slide-in-from-top-1">
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
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
          // Ignore React 18 StrictMode double-mounting issue
          return;
        }
        console.error("Failed to start scanner", err);
        setScanStatus("error");
        setMessage("Camera access denied or unavailable.");
      }
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      try {
        if (scannerRef.current?.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      } catch (e) {
        // Ignore stop errors on unmount
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scanStatus === "scanning" || scanStatus === "success") return;
    
    // Temporarily stop scanning to process
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
        setPlayerInfo(null);
        setMessage(result.error || "Invalid ticket");
      }
    } catch (error) {
      console.error(error);
      setScanStatus("error");
      setPlayerInfo(null);
      setMessage("Network error or invalid response");
    }
  };

  const onScanFailure = (error: any) => {
    // continuously failing when no QR code is in view, ignore
  };

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-sm bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
        <div className="p-4 bg-neutral-800/50 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            Scan Ticket
          </h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-neutral-400 font-medium tracking-wide uppercase">Live</span>
          </div>
        </div>
        
        {/* Scanner container */}
        <div className="relative bg-black aspect-square">
          <div id="reader" className="w-full h-full"></div>
          
          {/* Overlay for processing/results */}
          {scanStatus !== "idle" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-6 text-center animate-in fade-in duration-200">
              {scanStatus === "scanning" && (
                <>
                  <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                  <p className="text-lg font-medium text-white">{message}</p>
                </>
              )}
              {scanStatus === "success" && (
                <>
                  <CheckCircle className="w-12 h-12 text-emerald-400 mb-3 animate-in zoom-in" />
                  <p className="text-2xl font-bold text-white mb-1">{participantName}</p>
                  <p className="text-emerald-400 font-medium text-sm mb-4">{message}</p>
                  
                  {playerInfo && (
                    <div className="bg-neutral-800/50 border border-emerald-500/30 rounded-xl p-3 w-full mb-4 text-left grid grid-cols-2 gap-2 text-sm">
                      <div className="text-neutral-400 text-xs">Phone: <span className="text-white text-sm block">{playerInfo.phone || 'N/A'}</span></div>
                      <div className="text-neutral-400 text-xs">Skill: <span className="text-white text-sm block">{playerInfo.proficiency || 'N/A'}</span></div>
                      <div className="text-neutral-400 text-xs">Experience: <span className="text-white text-sm block">{playerInfo.duration || 'N/A'}</span></div>
                      <div className="text-neutral-400 text-xs">Shoes: <span className="text-white text-sm block">{playerInfo.shoes || 'N/A'}</span></div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      setScanStatus("idle");
                      if (scannerRef.current?.getState() === 2 /* PAUSED */) {
                        scannerRef.current.resume();
                      }
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    Scan Next Player
                  </button>
                </>
              )}
              {scanStatus === "error" && (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mb-4 animate-in zoom-in" />
                  <p className="text-lg font-medium text-white mb-2">Scan Failed</p>
                  <p className="text-red-400 text-sm">{message}</p>
                  <button 
                    onClick={() => {
                      setScanStatus("idle");
                      if (scannerRef.current?.getState() === 2 /* PAUSED */) {
                        scannerRef.current.resume();
                      }
                    }}
                    className="mt-8 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-medium transition-colors border border-neutral-700"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="p-4 bg-neutral-800/30 text-center">
          <p className="text-sm text-neutral-400">Position the QR code within the frame</p>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Live Roster</h2>
          <p className="text-neutral-400 text-sm mt-1">
            {checkedInCount} of {roster.length} participants checked in
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={loading || isResetting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-50 rounded-lg font-medium transition-colors border border-red-500/20"
          >
            {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Clear Roster</span>
          </button>
          <button
            onClick={fetchRoster}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors border border-neutral-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading && !isResetting ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-800/50 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Participant</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Details</th>
                  <th className="px-6 py-4 font-medium">Check-in Status</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {loading && roster.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
                      <p className="text-neutral-400">Loading roster...</p>
                    </td>
                  </tr>
                ) : roster.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                      No participants registered yet.
                    </td>
                  </tr>
                ) : (
                  roster.map((person, i) => (
                    <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-200">{person.name}</div>
                        <div className="text-neutral-500 text-xs mt-0.5">{person.email}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-xs text-neutral-400 space-y-1">
                        <div>Phone: <span className="text-neutral-200">{person.phone || '-'}</span></div>
                        <div>Skill: <span className="text-neutral-200">{person.proficiency || '-'}</span></div>
                        <div>Exp: <span className="text-neutral-200">{person.duration || '-'}</span></div>
                        <div>Shoes: <span className="text-neutral-200">{person.shoes || '-'}</span></div>
                      </td>
                      <td className="px-6 py-4">
                        {person.status === "Checked In" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-neutral-400">
                        {person.checkInTime ? new Date(person.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
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
