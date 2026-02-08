"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Cloud, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Github, 
  Globe, 
  HardDrive,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Animasi Variabel
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-blue-100 selection:text-blue-600">
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <HardDrive className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tighter uppercase italic">DriveBridge</span>
          </div>
          <button 
            onClick={() => router.push("/upload/test")}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Sign In <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Teks Kiri */}
            <motion.div 
              variants={containerVars}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 border border-blue-100">
                <Zap size={16} className="fill-blue-600" />
                <span className="text-xs font-black uppercase tracking-widest">Optimized for PKL 2026</span>
              </motion.div>

              <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Kelola File <br /> 
                <span className="text-blue-600 italic">Cloud</span> Jadi Lebih <br /> Personal.
              </motion.h1>

              <motion.p variants={itemVars} className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                Platform manajemen Google Drive cerdas yang memisahkan folder berdasarkan identitas user secara otomatis. Aman, cepat, dan terorganisir.
              </motion.p>

              <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => router.push("/upload/test")}
                  className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Mulai Sekarang <ArrowRight size={20} />
                </button>
                <div className="flex items-center gap-3 px-6 py-5 text-slate-400 font-bold text-sm underline decoration-slate-200 underline-offset-8 cursor-help">
                  Lihat Dokumentasi
                </div>
              </motion.div>
            </motion.div>

            {/* Visual Kanan */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-[80px] opacity-10 animate-pulse" />
              <div className="relative bg-white border border-slate-100 rounded-[3rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Mockup UI List File */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${i === 1 ? 'bg-red-50 text-red-500' : i === 2 ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-12 bg-slate-100 rounded" />
                    </div>
                  ))}
                  <div className="flex justify-center pt-4">
                    <Cloud className="text-blue-600 w-12 h-12 opacity-20" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- FEATURES SECTION --- */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-blue-600"><ShieldCheck size={28} /></div>
            <h3 className="text-lg font-black text-slate-900 uppercase">Folder Isolation</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Satu akun cloud, folder berbeda untuk setiap nama. File Anda tidak akan tertukar dengan user lain.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-emerald-600"><Zap size={28} /></div>
            <h3 className="text-lg font-black text-slate-900 uppercase">Real-time Sync</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Unggah di sini, langsung muncul di Google Drive Anda. Tidak perlu lagi upload manual lewat web Drive.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-purple-600"><HardDrive size={28} /></div>
            <h3 className="text-lg font-black text-slate-900 uppercase">Simple UI</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Dashboard bersih tanpa iklan dan gangguan. Fokus pada pengelolaan file akademik dan PKL Anda.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#F8FAFC] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 grayscale opacity-50">
            <HardDrive className="text-slate-900 w-5 h-5" />
            <span className="font-black text-slate-900 text-lg uppercase tracking-tighter italic">DriveBridge</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] text-center mb-8">
            Project PKL Informatics Engineering © 2026
          </p>
          <div className="flex gap-8">
            <Github className="text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" size={20} />
            <Globe className="text-slate-300 hover:text-blue-600 cursor-pointer transition-colors" size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
}