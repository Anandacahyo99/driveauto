"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  LogIn, 
  Loader2, 
  HardDrive, 
  ShieldCheck, 
  Github, 
  Globe,
  LayoutGrid
} from "lucide-react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("drive_user");
    if (savedUser) {
      router.push("/upload/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 2) {
      setLoading(true);
      localStorage.setItem("drive_user", name.trim());
      setTimeout(() => {
        router.push("/upload/dashboard");
      }, 800);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-blue-100">
      
      {/* --- 1. HEADER (Glassmorphism) --- */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <HardDrive className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tighter uppercase italic">DriveBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-blue-600">Login</span>
              <span className="hover:text-slate-600 cursor-not-allowed">Docs</span>
              <span className="hover:text-slate-600 cursor-not-allowed">Support</span>
            </nav>
          </div>
        </div>
      </header>

      {/* --- 2. MAIN CONTENT (LOGIN CARD) --- */}
      <main className="flex-grow flex items-center justify-center p-6 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] relative"
        >
          {/* Ornamen dekoratif dibelakang card */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-10 border border-slate-100 relative overflow-hidden">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600"
              >
                <User size={40} />
              </motion.div>
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Selamat Datang</h1>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
                Gunakan identitas Anda untuk memisahkan folder penyimpanan secara otomatis.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identitas User</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    type="text" required disabled={loading}
                    placeholder="Masukkan Nama Lengkap..."
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={name.trim().length <= 2 || loading}
                className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Drive</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2 text-slate-300">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Enkripsi Berbasis Identitas</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* --- 3. FOOTER (Minimalist) --- */}
      <footer className="py-10 border-t border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="text-slate-900 w-4 h-4" />
              <span className="font-black text-slate-900 text-sm tracking-tighter uppercase italic">DriveBridge</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              Secure Cloud Transfer System © 2026
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}