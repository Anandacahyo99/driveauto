import { drive } from "@/lib/gdrive";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // 1. Ambil userName dari URL (misal: /api/files?userName=nanda)
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName");

    if (!userName) {
      return NextResponse.json({ success: false, error: "UserName diperlukan" }, { status: 400 });
    }

    const mainFolderId = process.env.GDRIVE_FOLDER_ID;

    // 2. CARI ID FOLDER KHUSUS USER TERSEBUT
    const folderSearch = await drive.files.list({
      q: `name = '${userName}' and '${mainFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id)",
    });

    const userFolder = folderSearch.data.files?.[0];

    // Jika folder user belum ada (berarti belum pernah upload), kirim list kosong
    if (!userFolder) {
      return NextResponse.json({ success: true, files: [] });
    }

    // 3. AMBIL FILE HANYA DARI DALAM FOLDER USER TERSEBUT
    const response = await drive.files.list({
      // Gunakan ID folder user, bukan ID folder utama
      q: `'${userFolder.id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
      fields: "files(id, name, mimeType, webViewLink, size, createdTime)",
      orderBy: "createdTime desc",
    });

    return NextResponse.json({ success: true, files: response.data.files });
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}