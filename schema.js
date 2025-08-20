import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseType: text("case_type"),
  filingNumber: text("filing_number"),
  registrationNumber: text("registration_number"),
  cnrNumber: text("cnr_number"),
  firstHearingDate: text("first_hearing_date"),
  decisionDate: text("decision_date"),
  caseStatus: text("case_status"),
  natureOfDisposal: text("nature_of_disposal"),
  courtJudge: text("court_and_judge"),
  extractionTimestamp: text("extraction_timestamp"),
});

export const hearings = pgTable("hearings", {
  id: serial("id").primaryKey(),
  caseId: integer("caseId").references(() => cases.id, { onDelete: "cascade" }),
  hearingDate: text("hearing_date"),
  court: text("court"),
  business: text("business"),
  purpose: text("purpose"),
  nextHearingDate: text("next_hearing_date"),
});