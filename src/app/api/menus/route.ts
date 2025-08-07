import {
  addMenu,
  deleteMenu,
  findDataFirebaseByName,
  retrieveData,
} from "@/lib/firebase/service";
import { MenuSchema } from "@/schemas/menu.schema";
import { MenuItemApi } from "@/types/menus";
import { toTitleCase } from "@/utils/func";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const menus = await retrieveData("menus");
  return NextResponse.json({
    status: 200,
    message: "Success",
    data: menus,
  });
}

export async function POST(request: NextRequest) {
  try {
    const json: MenuItemApi = await request.json();
    const name = toTitleCase(json.name);
    const body = MenuSchema.parse(json);

    const data = await findDataFirebaseByName("menus", name);
    if (data.length) {
      return NextResponse.json({
        message: "Data sudah ada",
        data: { ...data[0] },
      });
    }

    const menu = await addMenu("menus", body);
    return NextResponse.json({
      status: 200,
      message: "Success",

      data: { id: menu, ...body },
    });
  } catch (error) {
    // if (error.name === "")
    //   const errors = error.errors.map((err) => ({
    //     path: err.path.join("."),
    //     message: err.message,
    //   }));
    return NextResponse.json({
      message: "Error",
      error,
    });
  }
}
