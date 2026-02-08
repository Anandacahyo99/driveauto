import { drive } from "@/lib/gdrive";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function GET() {
  // 1. Ambil folder ID dari env
  const folderId = process.env.GDRIVE_FOLDER_ID;

  // 2. Validasi variabel lingkungan secara mendalam
  const configCheck = {
    clientId: !!process.env.GDRIVE_CLIENT_ID,
    clientSecret: !!process.env.GDRIVE_CLIENT_SECRET,
    refreshToken: !!process.env.GDRIVE_REFRESH_TOKEN,
    folderId: !!folderId,
  };

  if (!configCheck.clientId || !configCheck.refreshToken || !configCheck.folderId) {
    return NextResponse.json({ 
      error: "Konfigurasi .env.local tidak lengkap", 
      configCheck 
    }, { status: 400 });
  }

  try {
    // 3. Buat konten testing
    const content = `Testing OAuth2 Sukses!\nUpload pada: ${new Date().toLocaleString()}`;
    const stream = Readable.from([content]);

    // 4. Proses Upload
    const response = await drive.files.create({
      requestBody: {
        name: `Success-Test-${Date.now()}.txt`,
        parents: [folderId], // Menggunakan variabel yang sudah divalidasi
      },
      media: {
        mimeType: "text/plain",
        body: stream,
      },
      // Menambahkan 'as any' untuk menghindari masalah type-checking pada versi library tertentu
      fields: "id, name",
    } as any);

    // 5. Response Berhasil
    return NextResponse.json({ 
      success: true, 
      message: "File berhasil dibuat di Google Drive",
      file: response.data 
    });

  } catch (error: any) {
    // Log detail error ke terminal untuk debugging
    const errorData = error.response?.data || error.message;
    console.error("DETAIL ERROR:", errorData);

    return NextResponse.json({ 
      success: false, 
      error: typeof errorData === 'string' ? errorData : errorData.error?.message || "Internal Server Error",
      googleError: error.response?.data 
    }, { status: 500 });
  }
}