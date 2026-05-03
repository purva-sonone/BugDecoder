"use client";

import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { 
  Play, 
  RotateCcw, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Bug, 
  AlertCircle,
  ChevronRight,
  Loader2,
  Trash2,
  History,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const LANGUAGES = [
  { id: "python", name: "Python", icon: "🐍" },
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "c", name: "C", icon: "C" },
  { id: "sql", name: "SQL", icon: "DB" },
  { id: "html", name: "HTML/CSS", icon: "🌐" },
];

export default function Dashboard() {
  const [code, setCode] = useState('print("Hello Bug Decoder!")');
  const [language, setLanguage] = useState("python");
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch History
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:8000/api/auth/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchHistory();
  }, []);

  const handleRun = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/debug/analyze", {
        code: code,
        language: language,
        manual_ai: true
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const { execution, ai_report } = response.data;
      
      if (ai_report) {
        setReport(ai_report);
        toast.success("Analysis complete!");
        fetchHistory(); // Refresh history after scan
      } else if (execution.stdout) {
        toast.success("Code executed successfully!");
        // We could show execution stdout in a separate tab or log
      } else if (execution.error) {
        toast.error("Execution failed: " + execution.error);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("API Connection failed. Is the backend running?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report?.full_code || code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const loadingToast = toast.loading("AI is reading your code...");
      
      try {
        const response = await axios.post("http://localhost:8000/api/debug/ocr", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.code) {
          setCode(response.data.code);
          toast.success("Code extracted successfully!", { id: loadingToast });
        }
      } catch (error: any) {
        console.error(error);
        toast.error("OCR Failed. Please check image quality.", { id: loadingToast });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-white overflow-hidden text-lg">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-[450px]" : "w-0 md:w-32"} border-r border-white/10 flex flex-col bg-[#121214] transition-all duration-300 overflow-hidden relative z-20`}>
        <div className="p-12 border-b border-white/5 flex items-center gap-8">
          <div className="bg-purple-600 p-6 rounded-[2rem] shrink-0">
            <Bug size={48} />
          </div>
          {isSidebarOpen && <span className="font-bold text-5xl truncate tracking-tighter">Bug Decoder</span>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <p className={`text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 ml-2 ${!isSidebarOpen && "md:hidden"}`}>Languages</p>
          <div className="space-y-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group ${
                  language === lang.id ? "bg-purple-600/20 text-purple-400 font-medium" : "text-gray-400 hover:bg-white/5"
                }`}
                title={lang.name}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg grayscale group-hover:grayscale-0 shrink-0">{lang.icon}</span>
                  {isSidebarOpen && <span className="truncate">{lang.name}</span>}
                </div>
                {isSidebarOpen && language === lang.id && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#8b5cf6]" />}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <p className={`text-xs font-bold text-gray-500 uppercase tracking-widest mb-5 ml-2 ${!isSidebarOpen && "md:hidden"}`}>Recent Activity</p>
            <div className="space-y-2">
              {history.slice(0, 5).map((scan: any) => (
                <button
                  key={scan._id}
                  onClick={() => {
                    setCode(scan.original_code);
                    setLanguage(scan.language);
                    if (scan.detected_errors?.[0]) setReport(scan.detected_errors[0]);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-gray-500 hover:text-white hover:bg-white/5 transition-all truncate flex items-center gap-2"
                  title={scan.original_code}
                >
                  <History size={12} className="shrink-0" />
                  {isSidebarOpen && <span className="truncate">{scan.original_code.substring(0, 20)}...</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="relative group">
            <div className={`flex items-center gap-5 p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-300 ${isSidebarOpen ? "w-full" : "w-20 justify-center px-0"} group-hover:bg-white/[0.06] group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-purple-500/10`}>
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center text-xl font-black shadow-lg shadow-purple-500/20">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "G"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#121214] rounded-full" />
              </div>
              
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black text-white truncate tracking-tight">{user?.full_name || "Guest User"}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 uppercase tracking-widest border border-purple-500/20">
                      {user?.plan || "free"}
                    </span>
                  </div>
                </div>
              )}

              {isSidebarOpen && (
                <button 
                  onClick={handleLogout}
                  className="p-3 hover:bg-red-500/10 rounded-2xl text-gray-500 hover:text-red-400 transition-all active:scale-90"
                  title="Logout"
                >
                  <LogOut size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Toolbar */}
        <div className="h-24 border-b border-white/10 flex items-center justify-between px-10 bg-[#0d0d0f] z-30 shrink-0">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-white/5 rounded-2xl text-gray-400 transition-all"
            >
              {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
            <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-xl border border-white/5">
              <span className="text-xs text-gray-500 font-mono uppercase hidden sm:inline">Language</span>
              <span className="text-base font-bold text-purple-400">{LANGUAGES.find(l => l.id === language)?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="Upload Screenshot"
            >
              <ImageIcon size={20} />
            </button>
            <button 
              onClick={() => setCode("")}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
              title="Clear Editor"
            >
              <Trash2 size={20} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button 
              onClick={handleRun}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-12 py-4 rounded-[2rem] text-2xl font-bold flex items-center gap-4 transition-all active:scale-95 shadow-2xl shadow-purple-900/40 whitespace-nowrap"
            >
              {isAnalyzing ? <Loader2 size={32} className="animate-spin" /> : <Play size={32} />}
              <span className="hidden sm:inline">{isAnalyzing ? "Analyzing..." : "Analyze Code"}</span>
              <span className="sm:hidden">{isAnalyzing ? "..." : "Run"}</span>
            </button>
          </div>
        </div>

        {/* Editor & Results Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Editor Container */}
          <div className="flex-1 relative border-r border-white/5">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'sql' ? 'sql' : language === 'html' ? 'html' : language}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 24,
                minimap: { enabled: false },
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                fontFamily: "var(--font-mono)",
                lineNumbersMinChars: 3,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                backgroundColor: "#0d0d0f"
              }}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('bugdecoder', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#0a0a0c',
                  }
                });
              }}
              onMount={(editor, monaco) => {
                monaco.editor.setTheme('bugdecoder');
              }}
            />
          </div>

          {/* Results Panel */}
          <AnimatePresence>
            {report && (
              <motion.div 
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="w-[450px] bg-[#0d0d0f] border-l border-white/10 flex flex-col"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                      <Bug size={18} />
                    </div>
                    <h2 className="font-bold">AI Diagnosis</h2>
                  </div>
                  <button onClick={() => setReport(null)} className="text-gray-500 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Issue Explanation */}
                  <section>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                      <AlertCircle size={14} className="text-amber-500" />
                      <span>The Problem</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                      {report.explanation}
                    </p>
                  </section>

                  {/* Fix Suggestion */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Check size={14} className="text-green-500" />
                        <span>Suggested Fix</span>
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="text-[10px] flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        {copied ? "Copied" : "Copy Fix"}
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                      <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-500">Corrected Block</span>
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Fixed</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-purple-300 overflow-x-auto">
                        <code>{report.suggested_fix}</code>
                      </pre>
                    </div>
                  </section>

                  {/* Beginner Tips */}
                  <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-purple-400 font-bold mb-1 italic">Mentor Tip:</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {report.mentor_tip || (language === 'python' 
                        ? "Double-check your indentation—it defines the logic in Python!" 
                        : "Always use meaningful variable names to make your code easier to debug.")}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-white/5">
                  <button 
                    onClick={handleCopy}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Copy size={16} />
                    Copy Complete Fixed Code
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!report && !isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center opacity-20">
                <Bug size={64} className="mx-auto mb-4" />
                <p className="text-sm font-medium">Write some code or upload a screenshot to start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
