import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { cases, hearings } from "./schema.js";
import { eq } from "drizzle-orm";



dotenv.config();


const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const db = drizzle(pool);


const filePath = path.join(process.cwd(), "case_data.json");
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function seed() {
  try {
    
    const c = jsonData.case_info;

    
    const insertedCase = await db
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

      const caseId = insertedCase[0].id;

      
      await db.insert(hearings).values(
        jsonData.hearings.map(h => ({
          caseId,
          hearingDate: h["Hearing Date"],
          court: h["Court"],
          business: h["Business"],
          purpose: h["Purpose"],
          nextHearingDate: h["Next Hearing Date"],
        }))
      );

      console.log(" Data seeded successfully!");
    } catch (err) {
      console.error(" Error inserting data:", err);
    } finally {
      await pool.end();
    }
}

seed();

const caseId = 1;

const caseWithHearings = await db
  .select()
  .from(cases)
  .leftJoin(hearings, eq(cases.id, hearings.caseId))
  .where(eq(cases.id, caseId));

const hearingWithCase = await db
  .select()
  .from(hearings)
  .leftJoin(cases, eq(hearings.caseId, cases.id))
  .where(eq(hearings.id, 1));