import * as z from "zod";

export const interviewReportSchema = z.object({
  match_Score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall match score between the candidate and the job description (0-100)"
    ),

  technical_questions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("Technical interview question"),

        intention: z
          .string()
          .describe("Purpose of asking this question"),

        answers: z
          .array(z.string())
          .min(2)
          .describe(
            "Key points that should be covered while answering the question"
          ),
      })
    )
    .min(4)
    .describe("List of technical interview questions"),

  behavioral_questions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("Behavioral interview question"),

        intention: z
          .string()
          .describe("Purpose of asking this behavioral question"),

        answers: z
          .array(z.string())
          .min(2)
          .describe(
            "Key discussion points for answering the behavioral question"
          ),
      })
    )
    .min(3)
    .describe("List of behavioral interview questions"),

  skill_gaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("Skill that the candidate needs to improve"),

        severity: z
          .enum(["low", "medium", "high"])
          .describe("Severity level of the skill gap"),
      })
    )
    .describe("Skills missing from the candidate profile"),

  preparation_plans: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .positive()
          .describe("Preparation day number"),

        focus_areas: z
          .array(z.string())
          .min(1)
          .describe("Topics to focus on during the day"),

        tasks: z
          .array(z.string())
          .min(1)
          .describe("Specific tasks to complete during the day"),
      })
    )
    .min(5)
    .describe("5-day interview preparation plan"),
});