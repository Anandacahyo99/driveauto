"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Github,
  Globe,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Calendar,
  LogIn,
  User,
  Trash2,
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
  
  // State untuk Delete Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 2. LOGIKA MOUNT & FETCH ---
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn]);

  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (data.success) setDriveFiles(data.files);
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
      setIsLoggedIn(true);
    }
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

  // Fungsi untuk memicu modal hapus
  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  // Fungsi eksekusi hapus permanen
  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/files/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDriveFiles((prev) => prev.filter((f) => f.id !== deleteId));
        setDeleteId(null);
      } else {
        alert("Gagal menghapus file dari server");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
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
          msg: `Sukses! File Anda tersimpan di folder: ${userName}`,
        });
        setFiles([]);
        fetchFiles();
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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <HardDrive className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight uppercase">DriveBridge</span>
          </div>
          {isLoggedIn && (
            <button onClick={fetchFiles} className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <RefreshCw size={20} className={`text-slate-500 ${loadingFiles ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-6 py-12">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            /* --- LAYAR 1: LOGIN --- */
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 text-center"
            >
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                <User className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">Private Drive</h1>
              <p className="text-slate-500 text-sm mb-8">Masukkan nama untuk mengakses folder pribadi.</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text" required placeholder="Nama Anda..."
                  value={userName} onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 text-center"
                />
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <LogIn size={18} /> Masuk Sekarang
                </button>
              </form>
            </motion.div>
          ) : (
            /* --- LAYAR 2: DASHBOARD --- */
            <div className="w-full max-w-4xl flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 mb-16"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-blue-50 p-2 rounded-xl"><User className="text-blue-600 w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">User Aktif</p>
                      <p className="text-sm font-bold text-slate-800">{userName}</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsLoggedIn(false); setStatus({type:"", msg:""}); }} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-all">Keluar</button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <label className="group flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-blue-50 transition-all">
                    <div className="bg-blue-50 p-3 rounded-2xl mb-3 group-hover:bg-blue-100 transition-all text-blue-600"><Upload className="w-6 h-6" /></div>
                    <p className="text-sm text-slate-600 font-bold">Pilih File</p>
                    <input type="file" multiple className="hidden" onChange={handleFileChange} />
                  </label>

                  {files.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-700 truncate px-2">{f.name}</span>
                          <X size={14} className="text-slate-300 cursor-pointer hover:text-red-500" onClick={() => removeFile(i)} />
                        </div>
                      ))}
                    </div>
                  )}

                  <button type="submit" disabled={files.length === 0 || uploading} className="w-full py-4 rounded-2xl font-black text-white bg-blue-600 shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all uppercase tracking-widest text-xs">
                    {uploading ? <Loader2 className="animate-spin mx-auto" /> : `Simpan ke Folder ${userName}`}
                  </button>
                </form>

                {status.type && (
                  <div className={`p-4 rounded-2xl mt-6 flex items-center gap-3 border-2 ${status.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
                    {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-xs font-bold">{status.msg}</span>
                  </div>
                )}
              </motion.div>

              {/* Riwayat Files Section */}
              <div className="w-full px-2">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <HardDrive size={24} className="text-blue-600" /> Riwayat Cloud
                </h2>

                {loadingFiles ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm" />)}
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
                          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><File size={20} /></div>
                            <div className="overflow-hidden text-left">
                              <p className="font-bold text-slate-800 text-sm truncate">{file.name}</p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase">
                                <Calendar size={12} /> {new Date(file.createdTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a href={file.webViewLink} target="_blank" className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ExternalLink size={20} /></a>
                            <button onClick={() => confirmDelete(file.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                
                {driveFiles.length === 0 && !loadingFiles && (
                  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-400 font-medium">Folder ini masih kosong.</div>
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
              <p className="text-slate-500 text-sm mb-8">File akan dihapus secara permanen dari Google Drive.</p>
              <div className="flex gap-3">
                <button disabled={isDeleting} onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Batal</button>
                <button disabled={isDeleting} onClick={executeDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center justify-center">
                  {isDeleting ? <Loader2 className="animate-spin w-5 h-5" /> : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-slate-400">
          <p className="text-[10px] font-bold uppercase tracking-wider italic">Secure Private Cloud Transfer © 2026</p>
          <div className="flex gap-4">
            <Github size={18} className="hover:text-slate-600 cursor-pointer" />
            <Globe size={18} className="hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}