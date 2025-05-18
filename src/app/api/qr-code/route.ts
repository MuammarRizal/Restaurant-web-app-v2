import { addDataFirebase, retrieveData } from "@/lib/firebase/service"
import { NextRequest, NextResponse } from "next/server"
type qr_code = {
    id?: string;
    code?: string;
}
export async function GET(request: NextRequest){
    const menus = await retrieveData("qr_code")
    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menus
    })
}

export async function POST(request: NextRequest){
    const body = await request.json()
    const {code} = body
    const qr_code: qr_code[] = await retrieveData("qr_code")
    console.log({code})
     
    const foundQrCodes = qr_code.filter((item: qr_code) => item.code === code);
    console.log({foundQrCodes})
    
    if (foundQrCodes.length > 0) {
      return NextResponse.json({
        status: 409, 
        message: "Data sudah pernah digunakan",
        data: foundQrCodes 
      },{
        status: 409
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