import { deleteMenu } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

function getIdFromUrl(url: string) {
  const parts = url.split("/"); // pisah berdasarkan "/"
  return parts[parts.length - 1]; // ambil bagian terakhir
}

export async function POST(request: NextRequest) {
  const id = getIdFromUrl(request.url);
  try {
    const data = await deleteMenu("menus", id);
    if (!data) {
      return NextResponse.json({
        message: "Data Tidak ditemukan",
        id,
      });
    }
    return NextResponse.json({
      message: "Data Berhasil Dihapus",
      data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal server error",
    });
  }
}
