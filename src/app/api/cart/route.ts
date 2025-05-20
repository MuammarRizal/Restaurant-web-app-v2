import { addDataFirebase, retrieveData, updateOrderStatus } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    if (request.method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }
    try{
        const body = await request.json()
        const {cart,user} = body
        if (!cart || !user) {
            return NextResponse.json(
                { error: "Cart and user data are required" },
                { status: 400 }
            );
        }

        const data = await addDataFirebase("carts", {cart,user})

        return NextResponse.json(
            { 
                success: true, 
                data: {
                    cart, 
                    user
                } 
            },
            { status: 200 }
        );

    }catch(error){
        console.error("Error in POST /api/cart:", error);
            return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest){
    const menus = await retrieveData("carts")
    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menus
    })
}

export async function PUT(request: NextRequest){
    if (request.method !== "PUT") {
        return NextResponse.json(
            { error: "Method not allowed" },
            { status: 405 }
        );
    }
    try {
        const body = await request.json()
        const { docId, isReady } = body
        
        if (!docId || isReady === undefined) {
            return NextResponse.json(
                { error: "Document ID and order status are required" },
                { status: 400 }
            );
        }
        
        const success = await updateOrderStatus("carts", docId, isReady)
        
        if (success) {
            return NextResponse.json(
                {
                    success: true,
                    message: `Order status successfully updated to ${isReady ? 'ready' : 'not ready'}`
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "Failed to update order status" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in PUT /api/cart:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}