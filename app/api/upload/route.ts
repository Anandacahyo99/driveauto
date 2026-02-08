import { drive } from "@/lib/gdrive";
import { NextResponse } from "next/server";
import { Readable } from "stream";

// Fungsi untuk Mencari atau Membuat Folder berdasarkan Nama User
async function getOrCreateUserFolder(userName: string) {
  const mainFolderId = process.env.GDRIVE_FOLDER_ID;

  // 1. Cari apakah folder dengan nama tersebut sudah ada
  const search = await drive.files.list({
    q: `name = '${userName}' and '${mainFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
  });

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id; // Gunakan folder yang sudah ada
  }

  // 2. Jika tidak ada, buat folder baru
  const folder = await drive.files.create({
    requestBody: {
      name: userName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [mainFolderId!],
    },
    fields: "id",
  } as any);

  return folder.data.id;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    
    // MENGAMBIL NAMA USER DARI FRONTEND
    const userName = formData.get("userName") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Tidak ada file yang dipilih" }, { status: 400 });
    }

    if (!userName) {
      return NextResponse.json({ error: "Nama user diperlukan" }, { status: 400 });
    }

    // DAPATKAN ID FOLDER KHUSUS USER
    const userFolderId = await getOrCreateUserFolder(userName);

    // Proses upload semua file secara paralel
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const stream = Readable.from(buffer);

        const response = await drive.files.create({
          requestBody: {
            name: file.name,
            parents: [userFolderId!], // DIUBAH: Sekarang masuk ke folder user, bukan folder utama
          },
          media: {
            mimeType: file.type,
            body: stream,
          },
          fields: "id, name, webViewLink",
        } as any);

        return response.data;
      })
    );

    return NextResponse.json({ 
      success: true, 
      count: uploadResults.length,
      files: uploadResults,
      folderName: userName // Memberitahu frontend nama folder tujuan
    });

  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}