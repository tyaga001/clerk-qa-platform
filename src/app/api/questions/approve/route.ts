import { NextRequest, NextResponse } from "next/server";
import { approveQuestion } from "@/db/actions";

export async function PUT(req: NextRequest) {
  try {
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
