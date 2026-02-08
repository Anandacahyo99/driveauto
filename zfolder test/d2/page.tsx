"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, CheckCircle, AlertCircle, Loader2, X, Github, Globe,
  HardDrive, RefreshCw, Calendar, LogIn, User, Trash2, LogOut, Eye, Edit2, Check,
  FileText, FileCode, FileImage, FileVideo, FileArchive, FileSpreadsheet,
} from "lucide-react";

export default function PrivateDrivePage() {
  // --- 1. STATE MANAGEMENT ---
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [files, setFiles] = useState<File[]>([]); // Antrean upload
  const [driveFiles, setDriveFiles] = useState<any[]>([]); // File di Cloud
  const [uploading, setUploading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState(""); 
  const [currentExt, setCurrentExt] = useState(""); 

  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);

  // --- 2. LOGIKA MOUNT & FETCH ---
  useEffect(() => {
    setMounted(true);
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

  const filteredFiles = driveFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf": case "doc": case "docx": case "txt": return <FileText size={20} className="text-orange-500" />;
      case "xls": case "xlsx": case "csv": return <FileSpreadsheet size={20} className="text-emerald-500" />;
      case "png": case "jpg": case "jpeg": case "gif": return <FileImage size={20} className="text-blue-500" />;
      case "zip": case "rar": return <FileArchive size={20} className="text-amber-500" />;
      default: return <File size={20} className="text-slate-400" />;
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  // --- 3. HANDLER FUNGSI ---
  const fetchFiles = async () => {
    if (!userName) return;
    setLoadingFiles(true);
    try {
      const res = await fetch(`/api/files?userName=${encodeURIComponent(userName)}`);
      const data = await res.json();
      if (data.success) setDriveFiles(data.files);
    } catch (err) {
      console.error("Gagal load file");
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length > 2) {
      localStorage.setItem("drive_user", userName.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("drive_user");
    setIsLoggedIn(false);
    setUserName("");
    setDriveFiles([]);
  };

  // Fungsi seleksi file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      e.target.value = ""; // Reset input agar bisa pilih file yang sama
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: "success", msg: "Upload Berhasil!" });
        setFiles([]);
        fetchFiles();
      } else {
        setStatus({ type: "error", msg: data.error || "Gagal upload." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Koneksi bermasalah." });
    } finally {
      setUploading(false);
    }
  };

  // Rename & Preview Logic
  const startRename = (file: any) => {
    const nameParts = file.name.split(".");
    const ext = nameParts.length > 1 ? nameParts.pop() : "";
    setCurrentExt(ext || "");
    setNewName(nameParts.join("."));
    setRenamingId(file.id);
  };

  const handleRenameFile = async (id: string) => {
    const finalName = currentExt ? `${newName}.${currentExt}` : newName;
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: finalName }),
      });
      if (res.ok) {
        setDriveFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: finalName } : f)));
        setRenamingId(null);
      }
    } catch (err) { alert("Gagal rename"); }
  };

  const handlePreview = (file: any) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const previewUrl = file.webViewLink.replace("/view", "/preview");
    setPreviewFile({ url: previewUrl, name: file.name, type: ext || "" });
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
    } finally { setIsDeleting(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><HardDrive size={20} /></div>
            <span className="font-black text-slate-900 text-xl tracking-tighter italic uppercase">DriveBridge</span>
          </div>
          {isLoggedIn && (
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
              <LogOut size={16} /> Keluar
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-6 py-8">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 text-center border">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg"><User size={32} /></div>
              <h1 className="text-2xl font-black text-slate-900 mb-8 italic">Private Drive</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" required placeholder="Nama Anda..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none text-center font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Mulai Sekarang</button>
              </form>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* PANEL KIRI (UPLOAD) */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <div className="bg-white rounded-[2rem] shadow-sm border p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 text-left">
                      <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><User size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Aktif Sebagai</p>
                        {renamingId === "CURRENT_USER" ? (
                          <div className="flex items-center gap-2">
                            <input autoFocus value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={() => { localStorage.setItem("drive_user", userName); setRenamingId(null); }} className="text-sm font-bold border-b border-blue-500 outline-none w-24" />
                            <button onClick={() => setRenamingId(null)} className="text-emerald-500"><Check size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-800">{userName}</p>
                            <button onClick={() => setRenamingId("CURRENT_USER")} className="text-slate-300 hover:text-blue-500"><Edit2 size={12} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpload} className="space-y-6">
                    <label className="group flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-[1.5rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all">
                      <Upload className="text-slate-300 group-hover:text-blue-600 mb-2" />
                      <p className="text-xs font-bold text-slate-500">Klik pilih file</p>
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                    
                    {/* Antrean File yang akan diupload */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border text-left">
                          <span className="text-[10px] font-bold text-slate-700 truncate px-2">{f.name}</span>
                          <X size={14} className="text-slate-300 cursor-pointer hover:text-red-500" onClick={() => removeFile(i)} />
                        </div>
                      ))}
                    </div>

                    <button type="submit" disabled={files.length === 0 || uploading} className="w-full py-4 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-50 transition-all uppercase text-[10px]">
                      {uploading ? <Loader2 className="animate-spin mx-auto" /> : `Upload ${files.length} File`}
                    </button>
                  </form>

                  <AnimatePresence>
                    {status.type && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mt-6 flex items-center gap-3 border ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                        {status.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        <span className="text-[11px] font-bold">{status.msg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* KOLOM KANAN (DAFTAR FILE) */}
              <div className="lg:col-span-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2 text-left">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <HardDrive size={24} className="text-blue-600" /> Riwayat Cloud
                  </h2>
                  <div className="relative flex-grow max-w-md">
                    <input type="text" placeholder="Cari file..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold transition-all" />
                    <div className="absolute left-3 top-3 text-slate-400"><RefreshCw size={14} className={loadingFiles ? "animate-spin" : ""} /></div>
                  </div>
                  <button onClick={fetchFiles} className="hidden md:block p-2.5 bg-white border rounded-xl hover:bg-slate-50"><RefreshCw size={18} className={loadingFiles ? "animate-spin" : "text-slate-500"} /></button>
                </div>

                {loadingFiles ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredFiles.map((file) => (
                        <motion.div key={file.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8, x: -20 }} className="bg-white p-5 rounded-3xl border shadow-sm flex items-center justify-between group">
                          <div className="flex items-center gap-4 overflow-hidden text-left w-full">
                            <div className="bg-slate-50 p-3 rounded-2xl flex-shrink-0">{getFileIcon(file.name)}</div>
                            <div className="overflow-hidden w-full pr-2">
                              {renamingId === file.id ? (
                                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-blue-200">
                                  <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-transparent outline-none font-bold text-sm text-slate-800 w-full" />
                                  <span className="text-[10px] font-black text-slate-400 bg-slate-200 px-1 rounded uppercase">.{currentExt}</span>
                                  <button onClick={() => handleRenameFile(file.id)} className="text-emerald-500 p-1"><Check size={16}/></button>
                                  <button onClick={() => setRenamingId(null)} className="text-red-500 p-1"><X size={16}/></button>
                                </div>
                              ) : (
                                <p className="font-bold text-slate-800 text-sm truncate">{file.name}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest"><Calendar size={12} /> {new Date(file.createdTime).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => handlePreview(file)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                            <button onClick={() => startRename(file)} className="p-2 text-slate-300 hover:text-amber-500 transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => setDeleteId(file.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL COMPONENTS */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isDeleting && setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl text-center">
              <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2 italic">Hapus File?</h3>
              <div className="flex gap-3 mt-6">
                <button disabled={isDeleting} onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-xs">Batal</button>
                <button disabled={isDeleting} onClick={executeDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center text-xs">
                  {isDeleting ? <Loader2 className="animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {previewFile && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewFile(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full h-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-white text-left">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">{getFileIcon(previewFile.name)}</div>
                  <p className="font-black text-slate-800 text-sm truncate">{previewFile.name}</p>
                </div>
                <button onClick={() => setPreviewFile(null)} className="p-2.5 hover:bg-red-50 text-slate-400 rounded-full transition-all"><X size={24} /></button>
              </div>
              <div className="flex-grow bg-slate-50 relative overflow-hidden">
                {["jpg", "jpeg", "png", "webp"].includes(previewFile.type) ? (
                  <div className="w-full h-full flex items-center justify-center p-6"><img src={previewFile.url.replace("/preview", "/view")} alt={previewFile.name} className="max-w-full max-h-full object-contain rounded-xl" /></div>
                ) : (
                  <iframe src={previewFile.url} className="w-full h-full border-none" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t py-10 mt-auto px-6 flex items-center justify-between text-slate-400">
        <p className="text-[10px] font-bold uppercase italic tracking-widest">Bridge.Cloud Secure Transfer © 2026</p>
        <div className="flex gap-4">
          <Github size={18} className="hover:text-slate-600 transition-colors cursor-pointer" />
          <Globe size={18} className="hover:text-slate-600 transition-colors cursor-pointer" />
        </div>
      </footer>
    </div>
  );
}