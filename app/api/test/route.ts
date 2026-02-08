import { drive } from "@/lib/gdrive";

export async function GET() {
  try {
    const res = await drive.files.list({
      pageSize: 5,
    });

    return Response.json({
      success: true,
      files: res.data.files,
    });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
