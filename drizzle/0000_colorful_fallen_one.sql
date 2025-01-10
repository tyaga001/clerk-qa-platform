CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"approved" boolean,
	"user_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"approved" boolean,
	"user_id" integer NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;