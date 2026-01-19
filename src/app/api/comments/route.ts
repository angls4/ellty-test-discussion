import { NextRequest, NextResponse } from "next/server";
import { commentService } from "../../../models/comment/service";
import { authenticate } from '../../../middleware/auth';
import { AppError } from '../../../utils/errors';
import { CreateCommentDTO } from "@/types/comment";

export async function POST(req: NextRequest) {
  const authResult = await authenticate(req);
  if (authResult.error || !authResult.user) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body:CreateCommentDTO = {
        ...await req.json(),
        authorId: authResult.user._id,
    };
    const comment = await commentService.createComment(body);
    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { error: error.message },
      { status: statusCode }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const rootId = url.searchParams.get("rootId");
        const comments = await commentService.getComments(rootId || null);
        return NextResponse.json(comments);
    } catch (error: any) {
        const statusCode = error instanceof AppError ? error.statusCode : 500;
        return NextResponse.json(
        { error: error.message },
        { status: statusCode }
        );
    }
}
