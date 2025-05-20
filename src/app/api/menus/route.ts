import { addMenu, retrieveData } from "@/lib/firebase/service";
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
    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menus
    })
}

export async function POST(request: NextRequest){
    const body = await request.json()
    const {menu} = body
    console.log(menu)

    const menus = await addMenu("menus",menu)
    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menus
    })
}