import {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
} from "@/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { quiz, approved, contributor, contributorId } = await req.json();

  try {
    await createQuestion({
      id: null, // Assuming you have a function to generate unique IDs
      quiz,
      approved,
      contributor,
      contributorId,
      answers: [], // Assuming answers is an array
      timestamp: new Date().toISOString(), // Assuming timestamp is a string
    });
    return NextResponse.json({ message: "Question created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const questions = await getAllQuestions();
    return NextResponse.json(questions, { status: 200 });
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
    const updatedQuestion = await updateQuestion(id, newText);
    return NextResponse.json(updatedQuestion, { status: 200 });
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
    const deletedQuestion = await deleteQuestion(id);
    return NextResponse.json(deletedQuestion, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}
