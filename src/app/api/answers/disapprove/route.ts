import { NextRequest, NextResponse } from "next/server";
import { disapproveAnswer } from "@/db/actions";

export async function PUT(req: NextRequest) {
  try {
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
