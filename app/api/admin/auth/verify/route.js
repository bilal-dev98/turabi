import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get("cj_admin_session")?.value;
        const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");

        const token = cookieToken || headerToken;

        if (!token || !token.startsWith("cj_admin_token_")) {
            return NextResponse.json({ success: false, authenticated: false, message: "Unauthorized" });
        }

        return NextResponse.json({
            success: true,
            authenticated: true,
            admin: {
                name: "Chand Jewelry Administrator",
                email: "admin@admin.com",
                role: "Super Admin"
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, authenticated: false });
    }
}
