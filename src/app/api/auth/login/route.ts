import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/models/user/service";
import { AppError } from "@/utils/errors";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    const result = await userService.login(username, password);
    
    // Save token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", result.token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: statusCode }
    );
  }
}
