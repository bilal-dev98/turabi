import { uploadToR2 } from "@/lib/r2";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        // Sanitise file name and make it unique
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const fileName = `${Date.now()}_${safeName}`;

        const fileBuffer = await file.arrayBuffer();

        // Upload to Cloudflare R2
        const publicUrl = await uploadToR2(fileBuffer, fileName, file.type || "image/jpeg");

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
