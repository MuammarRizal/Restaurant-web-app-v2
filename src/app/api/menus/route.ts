import { NextRequest, NextResponse } from "next/server";
type MenuItem = {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  

export async function GET(request: NextRequest){
    const menuItems : MenuItem[] = [
        { id: 1, name: "Nasi Goreng Spesial", price: 25000, category: "Makanan", image: "https://sanex.co.id/wp-content/uploads/2024/11/2734.jpg" },
        { id: 2, name: "Mie Ayam Jamur", price: 20000, category: "Makanan", image: "https://www.unileverfoodsolutions.co.id/dam/global-ufs/mcos/SEA/calcmenu/recipes/ID-recipes/general/Mie-Ayam-Jamur-Enak-dan-Praktis-/RESEP%20MIE%20AYAM%20JAMUR-header.jpeg" },
        { id: 3, name: "Ayam Bakar Madu", price: 30000, category: "Makanan", image: "https://cdn1-production-images-kly.akamaized.net/vxvwNUeOwrEXXW4vOZN8Dr_WrCc=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4583813/original/020048500_1695287593-WhatsApp_Image_2023-09-21_at_15.18.15.jpeg" },
        { id: 7, name: "Sate Ayam (10 tusuk)", price: 22000, category: "Makanan", image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg" },
        { id: 8, name: "Gado-Gado", price: 18000, category: "Makanan", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
        { id: 9, name: "Soto Ayam", price: 17000, category: "Makanan", image: "https://cdn0-production-images-kly.akamaized.net/mt8u4L3vLg8WxY9X9Q3g0w0Xx6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
        
        // Minuman
        { id: 4, name: "Es Teh Manis", price: 5000, category: "Minuman", image: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/06/15093247/Ketahui-Fakta-Es-Teh-Manis.jpg" },
        { id: 5, name: "Jus Alpukat", price: 15000, category: "Minuman", image: "https://res.cloudinary.com/dk0z4ums3/image/upload/v1708574230/attached_image/7-manfaat-jus-alpukat-bagi-kesehatan-yang-sayang-untuk-dilewatkan.jpg" },
        { id: 6, name: "Kopi Susu", price: 12000, category: "Minuman", image: "https://www.nescafe.com/id/sites/default/files/2023-08/Jenis-jenis_Kopi_Susu_yang_Enak__Menyegarkan._Sudah_Pernah_Coba_hero.jpg" },
        { id: 10, name: "Es Jeruk", price: 8000, category: "Minuman", image: "https://asset.kompas.com/crops/6zW6zQJQ5hJg4i8z5V5Z5X5X5X5=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/media/2021/06/15/es-jeruk-nipis.jpg" },
        { id: 11, name: "Es Campur", price: 12000, category: "Minuman", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
        { id: 12, name: "Air Mineral", price: 3000, category: "Minuman", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
        
        // Dessert
        { id: 13, name: "Pisang Goreng", price: 10000, category: "Dessert", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
        { id: 14, name: "Klepon", price: 8000, category: "Dessert", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },    
    ]

    return NextResponse.json({
        status: 200,
        message: "Success",
        data: menuItems
    })
}