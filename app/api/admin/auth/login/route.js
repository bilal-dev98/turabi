import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, securityAnswer, captchaAnswer, num1, num2 } = body;

        // 1. Validate Math Captcha
        if (typeof num1 !== 'number' || typeof num2 !== 'number' || parseInt(captchaAnswer) !== (num1 + num2)) {
            return NextResponse.json({ success: false, message: "Invalid Captcha answer. Please solve the math problem." }, { status: 400 });
        }

        // 2. Validate Security Question (CJ27)
        if (!securityAnswer || securityAnswer.trim().toUpperCase() !== "CJ27") {
            return NextResponse.json({ success: false, message: "Incorrect Security Code / Security Question answer." }, { status: 401 });
        }

        // 3. Validate Email and Password
        const cleanEmail = (email || "").trim().toLowerCase();
        if (cleanEmail !== "admin@admin.com" || password !== "admin@admin.com") {
            return NextResponse.json({ success: false, message: "Invalid Admin Email or Password." }, { status: 401 });
        }

        // Create Admin Token
        const token = "cj_admin_token_" + Buffer.from(`admin@admin.com:${Date.now()}:CJ27`).toString("base64");

        const cookieStore = await cookies();
        cookieStore.set("cj_admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            success: true,
            message: "Authentication successful!",
            token,
            admin: {
                name: "Chand Jewelry Administrator",
                email: "admin@admin.com",
                role: "Super Admin"
            }
        });
    } catch (error) {
        console.error("Admin Auth Login error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
    }
}
