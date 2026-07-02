import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interviewreport = async (job_description, self_description, resume) => {
  try {
    const prompt = `
You are an expert software engineering interviewer and career coach.

Your task is to analyze the candidate based on:

1. Job Description
2. Candidate Self Description
3. Candidate Resume

Generate a complete interview preparation report.

IMPORTANT RULES:

- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap the response inside \`\`\`.
- Do NOT explain anything outside the JSON.
- Follow the provided response schema exactly.
- Every required property must be present.
- Never rename any property.

The JSON must contain exactly these top-level properties:

{
  "match_Score": number,
  "technical_questions": [],
  "behavioral_questions": [],
  "skill_gaps": [],
  "preparation_plans": []
}

-------------------------------------

1. match_Score

Return a number between 0 and 100.

-------------------------------------

2. technical_questions

Return 6-8 questions.

Each item MUST be:

{
  "question": "...",
  "intention": "...",
  "answers": [
      "...",
      "...",
      "..."
  ]
}

answers should contain bullet points (not one paragraph).

-------------------------------------

3. behavioral_questions

Return 4-5 questions.

Each item MUST be:

{
  "question": "...",
  "intention": "...",
  "answers": [
      "...",
      "...",
      "..."
  ]
}

-------------------------------------

4. skill_gaps

Return at least 3 objects.

Each item MUST be:

{
  "skill": "...",
  "severity": "low"
}

Severity MUST ONLY be one of:

low
medium
high

-------------------------------------

5. preparation_plans

Return exactly 5 preparation plans.

Each item MUST be:

{
  "day": 1,
  "focus_areas": [
      "...",
      "..."
  ],
  "tasks": [
      "...",
      "...",
      "..."
  ]
}

The value of "day" must be a NUMBER.

Example:

1
2
3

NOT

"Day 1"

and last but not a least just make sure that technical_questions , behavioral_questions , skill_gaps and preparation_plans contains array of an object as mention above not a string please keep this in mind so provide according to the schema only
-------------------------------------

Job Description

${job_description}

-------------------------------------

Candidate Self Description

${self_description}

-------------------------------------

Resume

${resume}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const reportText = response?.text?.trim();

    if (!reportText) {
      throw new Error("The interview report service did not return a valid response.");
    }

    return reportText;
  } catch {
    throw new Error("Unable to generate the interview report right now.");
  }
};

const generateResume = async (job_description, self_description, resume) => {
  let browser = null;

  try {
    const prompt = `
You are an expert resume writer and career coach and you are an expert in generating resumes for software engineers.

Your task is to analyze the candidate based on job description, self description and resume and generate a complete resume in html format.

IMPORTANT RULES: the resume should be in html format and should be well structured and should be professional and should be ATS friendly and should be visually appealing and should be easy to read and should be easy to scan and should be easy to navigate and should be easy to understand and should be easy to follow and should be easy to remember and should be easy to share and should be easy to print and should be easy to download and should be easy to email and should be easy to upload and should be easy to submit and should be easy to apply and should be easy to interview and should be easy to get hired.

The resume should contain the following sections: header, summary, skills, experience, education, projects, certifications, awards, publications, languages, interests, references and contact information. and the resume should satisfy job description and self description and resume and should be tailored to the job description and self description and resume and should be optimized for ATS and should be optimized for human readers and should be optimized for recruiters and should be optimized for hiring managers and should be optimized for interviewers and should be optimized for employers and should be optimized for clients and should be optimized for customers and should be optimized for stakeholders and should be optimized for investors and should be optimized for partners and should be optimized for collaborators and should be optimized for team members and should be optimized for colleagues and should be optimized for peers and should be optimized for mentors and should be optimized for mentees and should be optimized for coaches and should be optimized for trainees and should be optimized for students and should be optimized for teachers and should be optimized for professors and should be optimized for researchers and should be optimized for scientists and should be optimized for engineers.

The following is the job description: ${job_description}
The following is the self description: ${self_description}
The following is the resume: ${resume}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const htmlResume = response?.text?.trim();

    if (!htmlResume) {
      throw new Error("The resume generator did not return a valid response.");
    }

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlResume, { waitUntil: "networkidle0" });

    return await page.pdf({ format: "A4" });
  } catch {
    throw new Error("Unable to generate the resume PDF right now.");
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
};

export { interviewreport, generateResume };
