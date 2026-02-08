"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Image as ImageIcon, Box, HardDrive, 
  ArrowLeft, PieChart, BarChart3, Activity 
} from "lucide-react";
import Link from "next/link";

export default function StatisticsPage() {
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("drive_user");
    if (savedUser) {
      setUserName(savedUser);
      fetchFiles(savedUser);
    }
  }, []);

  const fetchFiles = async (user: string) => {
    try {
      const res = await fetch(`/api/files?userName=${encodeURIComponent(user)}`);
      const data = await res.json();
      if (data.success) setDriveFiles(data.files);
    } catch (err) {
      console.error("Gagal memuat statistik");
    } finally {
      setLoading(false);
    }
  };

  // Logika Pengolahan Data
  const totalFiles = driveFiles.length;
  const pdfFiles = driveFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'));
  const imgFiles = driveFiles.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name));
  const otherFiles = totalFiles - (pdfFiles.length + imgFiles.length);

  const stats = [
    { label: "Semua File", value: totalFiles, icon: <HardDrive size={24} />, color: "bg-blue-600", lightColor: "bg-blue-50" },
    { label: "Dokumen PDF", value: pdfFiles.length, icon: <FileText size={24} />, color: "bg-orange-500", lightColor: "bg-orange-50" },
    { label: "Gambar", value: imgFiles.length, icon: <ImageIcon size={24} />, color: "bg-emerald-500", lightColor: "bg-emerald-50" },
    { label: "Lainnya", value: otherFiles, icon: <Box size={24} />, color: "bg-slate-500", lightColor: "bg-slate-50" },
  ];

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-bold">Menghitung Data...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Tombol Kembali */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest mb-8">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Analitik Cloud</h1>
          <p className="text-slate-500 font-medium">Laporan ringkasan berkas untuk user: <span className="text-blue-600 font-bold">{userName}</span></p>
        </header>

        {/* Grid Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className={`${stat.lightColor} text-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                {stat.icon}
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Visualisasi Sederhana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <PieChart className="text-blue-600" /> Distribusi Format
            </h3>
            <div className="space-y-6">
               {stats.slice(1).map((s, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-xs font-bold uppercase mb-2">
                      <span className="text-slate-500">{s.label}</span>
                      <span className="text-slate-900">{totalFiles > 0 ? ((s.value / totalFiles) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${totalFiles > 0 ? (s.value / totalFiles) * 100 : 0}%` }}
                        className={`h-full ${s.color}`}
                      />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <Activity className="absolute -right-10 -bottom-10 w-64 h-64 text-blue-500 opacity-20" />
            <h3 className="text-lg font-black mb-4 flex items-center gap-3">
              <BarChart3 /> Status Penyimpanan
            </h3>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">
              Sistem telah mendeteksi <span className="font-bold text-white">{totalFiles} file</span> di dalam folder cloud kamu. Gunakan dashboard utama untuk mengelola berkas.
            </p>
            <Link href="/" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-lg">
              Kelola File Sekarang
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}