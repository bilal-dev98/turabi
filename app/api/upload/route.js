import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

        const { data, error } = await supabase.storage
            .from("products")
            .upload(fileName, fileBuffer, {
                contentType: file.type || "image/jpeg",
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
