import { drive } from "@/lib/gdrive";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Tambahkan Promise di sini
) {
  try {
    // 2. Gunakan await untuk mengambil id
    const { id } = await params; 
    const fileId = id;

    if (!fileId) {
      return NextResponse.json({ error: "ID File tidak ditemukan" }, { status: 400 });
    }

    await drive.files.delete({
      fileId: fileId,
    });

    return NextResponse.json({ success: true, message: "File berhasil dihapus" });
  } catch (error: any) {
    console.error("Delete Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus file dari Drive" },
      { status: 500 }
    );
  }
}