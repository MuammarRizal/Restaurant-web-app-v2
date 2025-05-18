import { addDataFirebase, retrieveData } from "@/lib/firebase/service"
import { NextRequest, NextResponse } from "next/server"
interface qr_code {
    id: string;
    code: string;
}
export async function GET(request: NextRequest){
    const menus = await retrieveData("qr_code")
    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menus
    })
}

export async function POST(request: NextRequest,response: NextResponse){
    const body = await request.json()
    const {code} = body
    const qr_code = await retrieveData("qr_code")
     
    const foundQrCodes = qr_code.filter((item: any) => item.code === code);
    console.log({foundQrCodes})
    
    if (foundQrCodes.length > 0) {
      return NextResponse.json({
        status: 409, 
        message: "Data sudah pernah digunakan",
        data: foundQrCodes 
      });
    } else {
      const data = await addDataFirebase("qr_code",{code})
      return NextResponse.json({
        status: 200, 
        message: "Pesan makanan sekarang",
        data
      });
    }
}