CREATE TABLE "cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_type" text,
	"filing_number" text,
	"registration_number" text,
	"cnr_number" text,
	"first_hearing_date" text,
	"decision_date" text,
	"case_status" text,
	"nature_of_disposal" text,
	"court_and_judge" text,
	"extraction_timestamp" text
);
--> statement-breakpoint
CREATE TABLE "hearings" (
	"id" serial PRIMARY KEY NOT NULL,
	"caseId" integer,
	"hearing_date" text,
	"court" text,
	"business" text,
	"purpose" text,
	"next_hearing_date" text
);
--> statement-breakpoint
ALTER TABLE "hearings" ADD CONSTRAINT "hearings_caseId_cases_id_fk" FOREIGN KEY ("caseId") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;