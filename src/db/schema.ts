import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quiz: text("quiz").notNull(),
  approved: boolean("approved"),
  contributor: text("contributor").notNull(),
  contributorId: text("contributor_id").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});

// Answers table
export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  ans: text("ans").notNull(),
  approved: boolean("approved"),
  contributor: text("contributor").notNull(),
  contributorId: text("contributor_id").notNull(),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});

// Define relationships using Drizzle's relations function
export const questionsRelations = relations(questions, ({ many }) => ({
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));
