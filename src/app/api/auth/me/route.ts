import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/middleware/auth";
import { userService } from "@/models/user/service";

export async function GET(req: NextRequest) {
  const authResult = await authenticate(req);
  
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  return NextResponse.json({ user: authResult.user }, { status: 200 });
}
