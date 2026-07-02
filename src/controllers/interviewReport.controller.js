import { PDFParse } from "pdf-parse";
import asyncHandler from "../utils/asyncHandler.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { generateResume, interviewreport } from "../services/Ai.js";
import { Apierror } from "../utils/Apierror.js";
import { interviewReportModel } from "../model/interviewReport.model.js";

const parseResumeText = async (resume) => {
  if (!resume?.buffer?.length) {
    throw new Apierror(400, "Resume PDF is mandatory.");
  }

  const parser = new PDFParse({ data: resume.buffer });

  try {
    const parsedContent = await parser.getText();
    return parsedContent?.text?.trim() || "";
  } finally {
    await parser.destroy();
  }
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeQuestionItems = (items) =>
  items
    .map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }

      return item;
    })
    .filter(Boolean);

const GenerateinterviewReportController = asyncHandler(async (req, res) => {
  const { job_description, self_description } = req.body;

  if (!job_description?.trim() || !self_description?.trim()) {
    throw new Apierror(400, "Job description and self description are both required.");
  }

  const resumeContent = await parseResumeText(req.file);

  if (!resumeContent) {
    throw new Apierror(500, "Unable to extract text from the resume.");
  }

  const result = await interviewreport(job_description, self_description, resumeContent);

  if (!result || typeof result !== "string" || !result.trim()) {
    throw new Apierror(500, "Unable to generate the interview report right now.");
  }

  let report;

  try {
    report = JSON.parse(result);
  } catch {
    throw new Apierror(500, "The interview report service returned an invalid response.");
  }

  const technical_questions = normalizeQuestionItems(normalizeArray(report.technical_questions));
  const behavioral_questions = normalizeQuestionItems(normalizeArray(report.behavioral_questions));
  const skill_gaps = normalizeQuestionItems(normalizeArray(report.skill_gaps));
  const preparation_plans = normalizeQuestionItems(normalizeArray(report.preparation_plans));

  const interviewReport = await interviewReportModel.create({
    job_description,
    resume: resumeContent,
    self_description,
    match_Score: report.match_Score,
    technical_questions,
    behavioral_questions,
    skill_gaps,
    preparation_plans,
    user: req.user?._id,
  });

  if (!interviewReport) {
    throw new Apierror(500, "Failed to save the interview report.");
  }

  return res.status(201).json(new Apiresponse(201, "Interview report generated successfully.", interviewReport));
});

const getAllInterviewReport = asyncHandler(async (req, res) => {
  const allReport = await interviewReportModel.find({ user: req.user?._id }).sort({ createdAt: -1 });

  return res.status(200).json(new Apiresponse(200, "All the reports fetched successfully.", allReport || []));
});

const generateResumec = asyncHandler(async (req, res) => {
  const { job_description, self_description } = req.body;

  if (!job_description?.trim() || !self_description?.trim()) {
    throw new Apierror(400, "Job description and self description are both required.");
  }

  const resumeContent = await parseResumeText(req.file);

  if (!resumeContent) {
    throw new Apierror(500, "Unable to extract text from the resume.");
  }

  const result = await generateResume(job_description, self_description, resumeContent);

  if (!result || (!Buffer.isBuffer(result) && !(result instanceof Uint8Array))) {
    throw new Apierror(500, "Unable to generate the resume PDF right now.");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="Interview_Report.pdf"');

  return res.send(result);
});

export { GenerateinterviewReportController, getAllInterviewReport, generateResumec };