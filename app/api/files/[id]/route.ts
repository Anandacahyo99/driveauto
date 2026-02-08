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



export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Ubah tipe data menjadi Promise
) {
  try {
    // 2. Unwrapping params menggunakan await
    const { id } = await params; 
    const { newName } = await req.json();

    if (!id || !newName) {
      return NextResponse.json({ error: "ID atau nama baru diperlukan" }, { status: 400 });
    }

    const response = await drive.files.update({
      fileId: id,
      requestBody: {
        name: newName,
      },
    });

    return NextResponse.json({ success: true, file: response.data });
  } catch (error) {
    console.error("Ganti nama gagal:", error);
    return NextResponse.json({ success: false, error: "Gagal ganti nama" }, { status: 500 });
  }
}