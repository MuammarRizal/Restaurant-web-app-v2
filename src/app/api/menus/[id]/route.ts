import { deleteMenu, updateMenu } from "@/lib/firebase/service";
import { getIdFromUrl } from "@/utils/func";
import { NextRequest, NextResponse } from "next/server";

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

export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.url);
    const dataUpdate = await request.json();
    const data = await updateMenu("menus", id, dataUpdate);
    if (data.success) {
      return NextResponse.json({
        message: data.message,
        data: updateMenu,
      });
    } else {
      return NextResponse.json({
        message: data.message,
        data: updateMenu,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
      error,
    });
  }

  // const data = await updateMenu("menus", id, {});
}
