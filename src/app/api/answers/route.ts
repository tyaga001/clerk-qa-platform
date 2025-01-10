import {
  createAnswer,
  getAllAnswersForQuestion,
  updateAnswer,
  deleteAnswer,
} from "@/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { questionId, ans, contributor, contributorId } = await req.json();

  try {
    await createAnswer({
      id: null, // Assuming you have a function to generate unique IDs
      questionId,
      ans,
      contributor,
      contributorId,
      approved: null, // Assuming answers need approval
      timestamp: new Date().toISOString(), // Assuming timestamp is a string
    });
    return NextResponse.json({ message: "Answer added" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");
    if (!questionId) {
      throw new Error("Missing questionId");
    }
    const answers = await getAllAnswersForQuestion(Number(questionId));
    return NextResponse.json(answers, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, newText } = await req.json();
    const updatedAnswer = await updateAnswer(id, newText);
    return NextResponse.json(updatedAnswer, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const deletedAnswer = await deleteAnswer(id);
    return NextResponse.json(deletedAnswer, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}
