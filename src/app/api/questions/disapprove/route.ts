import { NextRequest, NextResponse } from "next/server";
import { disapproveQuestion } from "@/db/actions"; // Adjust the import according to your project structure

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();
    const updatedQuestion = await disapproveQuestion(id);
    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}
