ALTER TABLE "answers" RENAME COLUMN "user_id" TO "contributor_id";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "user_id" TO "contributor_id";--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "contributor" text NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "contributor" text NOT NULL;