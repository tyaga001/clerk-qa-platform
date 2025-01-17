import { NextRequest, NextResponse } from "next/server";
import { disapproveAnswer } from "@/db/actions";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  try {
    if (!userId) {
      return NextResponse.json(
          { message: "You must be signed in to disapprove an answer" },
          { status: 401 }
      );
    }

    const { id } = await req.json();
    const updatedAnswer = await disapproveAnswer(id);
    return NextResponse.json(updatedAnswer, { status: 200 });
  } catch (err) {
    return NextResponse.json(
        { message: "An error occurred", err },
        { status: 400 }
    );
  }
}