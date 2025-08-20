import fs from 'fs';
import path from 'path';
import { db } from './db.js';
import { cases, hearings } from './schema.js';

const filePath = path.join(process.cwd(), 'all_cases_output.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

async function insertData() {
  for (const item of jsonData.cases) {
    const c = item.case_info;

    const inserted = await db
      .insert(cases)
      .values({
        caseType: c["Case Type"],
        filingNumber: c["Filing Number"],
        registrationNumber: c["Registration Number"],
        cnrNumber: c["CNR Number"],
        firstHearingDate: c["First Hearing Date"],
        decisionDate: c["Decision Date"],
        caseStatus: c["Case Status"],
        natureOfDisposal: c["Nature of Disposal"],
        courtJudge: c["Court Number and Judge"],
        extractionTimestamp: c["extraction_timestamp"],
      })
      .returning({ id: cases.id });

    const caseId = inserted[0].id;

    for (const h of item.hearings) {
      await db.insert(hearings).values({
        caseId,
        hearingDate: h["Hearing Date"],
        court: h["Court"],
        business: h["Business"],
        purpose: h["Purpose"],
        nextHearingDate: h["Next Hearing Date"],
      });
    }
  }

  console.log("✅ All data inserted successfully!");
}

insertData().catch((err) => {
  console.error(" Error inserting data:", err);
});

