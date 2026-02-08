"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, CheckCircle, AlertCircle, Loader2, X, Github, Globe,
  HardDrive, RefreshCw, ExternalLink, Calendar, LogIn, User, Trash2, LogOut, Eye,
} from "lucide-react";

export default function PrivateDrivePage() {
  // --- 1. STATE MANAGEMENT ---
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 2. LOGIKA MOUNT & FETCH ---
  useEffect(() => {
    setMounted(true);
    // Cek jika sudah ada user di storage saat pertama kali buka
    const savedUser = localStorage.getItem("drive_user");
    if (savedUser) {
      setUserName(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && userName) {
      fetchFiles();
    }
  }, [isLoggedIn, userName]);

  const fetchFiles = async () => {
    // Pastikan userName tidak kosong sebelum fetch
    if (!userName) return;

    setLoadingFiles(true);
    try {
      // PERBAIKAN: Menambahkan query parameter ?userName= agar API memfilter folder
      const res = await fetch(`/api/files?userName=${encodeURIComponent(userName)}`);
      const data = await res.json();
      if (data.success) {
        setDriveFiles(data.files);
      } else {
        console.error("Gagal memuat file:", data.error);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar file");
    } finally {
      setLoadingFiles(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  // --- 3. HANDLER FUNGSI ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length > 2) {
      localStorage.setItem("drive_user", userName.trim()); // Simpan ke storage
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("drive_user");
    setIsLoggedIn(false);
    setUserName("");
    setDriveFiles([]);
    setStatus({ type: "", msg: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/files/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDriveFiles((prev) => prev.filter((f) => f.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      alert("Gagal menghapus file");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setStatus({ type: "", msg: "" });

    const formData = new FormData();
    formData.append("userName", userName);
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: "success",
          msg: `Berhasil tersimpan di folder: ${userName}`,
        });
        setFiles([]);
        fetchFiles(); // Refresh daftar file
      } else {
        setStatus({ type: "error", msg: data.error || "Gagal mengunggah." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Kesalahan koneksi." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased font-[family-name:var(--font-geist-sans)]">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <HardDrive className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tighter uppercase">DriveBridge</span>
          </div>
          
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            /* --- LAYAR 1: LOGIN --- */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 text-center"
            >
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                <User className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">Private Drive</h1>
              <p className="text-slate-500 text-sm mb-8 font-medium">Akses folder pribadi Anda.</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text" required placeholder="Ketik Nama Anda..."
                  value={userName} onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 text-center outline-none"
                />
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <LogIn size={18} /> Mulai Sekarang
                </button>
              </form>
            </motion.div>
          ) : (
            /* --- LAYAR 2: DASHBOARD (GRID LAYOUT) --- */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* KOLOM KIRI: PANEL UPLOAD (Sticky) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 space-y-6 lg:sticky lg:top-24"
              >
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><User size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Aktif Sebagai</p>
                      <p className="text-sm font-bold text-slate-800">{userName}</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpload} className="space-y-6">
                    <label className="group flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-100 rounded-[1.5rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all">
                      <Upload className="text-slate-300 group-hover:text-blue-600 mb-2 transition-colors" />
                      <p className="text-xs font-bold text-slate-500">Klik untuk pilih file</p>
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>

                    {files.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-700 truncate px-2">{f.name}</span>
                            <X size={14} className="text-slate-300 cursor-pointer hover:text-red-500" onClick={() => removeFile(i)} />
                          </div>
                        ))}
                      </div>
                    )}

                    <button type="submit" disabled={files.length === 0 || uploading} className="w-full py-4 rounded-xl font-black text-white bg-blue-600 shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-50 disabled:text-slate-300 transition-all uppercase tracking-widest text-[10px]">
                      {uploading ? <Loader2 className="animate-spin mx-auto" /> : `Upload ${files.length} File`}
                    </button>
                  </form>

                  <AnimatePresence>
                    {status.type && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mt-6 flex items-center gap-3 border ${status.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
                        {status.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        <span className="text-[11px] font-bold">{status.msg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* KOLOM KANAN: DAFTAR FILE */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <HardDrive size={24} className="text-blue-600" /> Riwayat Cloud
                  </h2>
                  <button onClick={fetchFiles} className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
                    <RefreshCw size={18} className={`text-slate-500 ${loadingFiles ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {loadingFiles ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border border-slate-100" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {driveFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, x: -20 }}
                          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4 overflow-hidden text-left">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <File size={20} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-slate-800 text-sm truncate">{file.name}</p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <Calendar size={12} /> {new Date(file.createdTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a href={file.webViewLink} target="_blank" title="Lihat di Drive" className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                              <Eye size={18} />
                            </a>
                            <button onClick={() => confirmDelete(file.id)} title="Hapus Permanen" className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                
                {driveFiles.length === 0 && !loadingFiles && (
                  <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400 font-medium">
                    Folder milik {userName} masih kosong.
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* --- MODAL KONFIRMASI DELETE --- */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isDeleting && setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 text-center">
              <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Hapus File?</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Tindakan ini permanen. File akan dihapus dari Google Drive.</p>
              <div className="flex gap-3">
                <button disabled={isDeleting} onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-xs">Batal</button>
                <button disabled={isDeleting} onClick={executeDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center justify-center text-xs">
                  {isDeleting ? <Loader2 className="animate-spin w-5 h-5" /> : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-slate-400">
          <p className="text-[10px] font-bold uppercase tracking-wider italic">Bridge.Cloud Secure Transfer © 2026</p>
          <div className="flex gap-4">
            <Github size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
            <Globe size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}