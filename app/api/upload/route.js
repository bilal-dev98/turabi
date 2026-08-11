import { uploadToR2 } from "@/lib/r2";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
        const buffer = Buffer.from(fileBuffer);

        let publicUrl = null;

        // 1. Try Cloudflare R2 Upload
        try {
            publicUrl = await uploadToR2(fileBuffer, fileName, file.type || "image/jpeg");
        } catch (r2Error) {
            console.warn("Cloudflare R2 upload error (falling back to local public upload):", r2Error.message || r2Error);

            // 2. Fallback to local filesystem upload (/public/uploads)
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, buffer);
            publicUrl = `/uploads/${fileName}`;
        }

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to upload file" },
            { status: 500 }
        );
    }
}
