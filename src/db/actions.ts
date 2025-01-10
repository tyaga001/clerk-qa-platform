import { db } from ".";
import { questions, answers } from "./schema";
import { desc, eq } from "drizzle-orm";

export const createQuestion = async (question: Question) => {
  await db.insert(questions).values({
    quiz: question.quiz,
    approved: question.approved,
    contributor: question.contributor,
    contributorId: question.contributorId,
  });
};

export const createAnswer = async (answer: Answer) => {
  await db.insert(answers).values({
    ans: answer.ans,
    approved: answer.approved,
    contributor: answer.contributor,
    contributorId: answer.contributorId,
    questionId: answer.questionId,
  });
};

export const getAllQuestions = async () => {
  return await db.select().from(questions).orderBy(desc(questions.timestamp));
};

export const getAllAnswersForQuestion = async (questionId: number) => {
  return await db
    .select()
    .from(answers)
    .where(eq(answers.questionId, questionId))
    .orderBy(desc(answers.timestamp));
};

export const deleteQuestion = async (id: number) => {
  try {
    await db.delete(answers).where(eq(answers.questionId, id));
    const result = await db.delete(questions).where(eq(questions.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw new Error("Failed to delete question");
  }
};

export const deleteAnswer = async (id: number) => {
  try {
    const result = await db.delete(answers).where(eq(answers.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw new Error("Failed to delete answer");
  }
};

export const updateQuestion = async (id: number, newText: string) => {
  try {
    const result = await db
      .update(questions)
      .set({ quiz: newText })
      .where(eq(questions.id, id));
    return result;
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Failed to update question");
  }
};

export const updateAnswer = async (id: number, newText: string) => {
  try {
    const result = await db
      .update(answers)
      .set({ ans: newText })
      .where(eq(answers.id, id));
    return result;
  } catch (error) {
    console.error("Error updating answer:", error);
    throw new Error("Failed to update answer");
  }
};

export const approveQuestion = async (id: number) => {
  try {
    const result = await db
      .update(questions)
      .set({ approved: true })
      .where(eq(questions.id, id));
    return result;
  } catch (error) {
    console.error("Error approving question:", error);
    throw new Error("Failed to approve question");
  }
};

export const disapproveQuestion = async (id: number) => {
  try {
    const result = await db
      .update(questions)
      .set({ approved: false })
      .where(eq(questions.id, id));
    return result;
  } catch (error) {
    console.error("Error disapproving question:", error);
    throw new Error("Failed to disapprove question");
  }
};

export const approveAnswer = async (id: number) => {
  try {
    const result = await db
      .update(answers)
      .set({ approved: true })
      .where(eq(answers.id, id));
    return result;
  } catch (error) {
    console.error("Error approving answer:", error);
    throw new Error("Failed to approve answer");
  }
};

export const disapproveAnswer = async (id: number) => {
  try {
    const result = await db
      .update(answers)
      .set({ approved: false })
      .where(eq(answers.id, id));
    return result;
  } catch (error) {
    console.error("Error disapproving answer:", error);
    throw new Error("Failed to disapprove answer");
  }
};
