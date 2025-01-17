import { NextRequest, NextResponse } from "next/server";
import { approveQuestion } from "@/db/actions";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();

  try {
    if (!userId) {
      return NextResponse.json(
          { message: "You must be signed in to approve a question" },
          { status: 401 }
      );
    }

    const { id } = await req.json();
    const updatedQuestion = await approveQuestion(id);
    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (err) {
    return NextResponse.json(
        { message: "An error occurred", err },
        { status: 400 }
    );
  }
}