import { retrieveData } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
type MenuItem = {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  

export async function GET(request: NextRequest){
    const menus = await retrieveData("menus")
    console.log({menus})
    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menus
    })
}