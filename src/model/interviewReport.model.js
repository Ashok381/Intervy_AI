import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answers: {
      type: [String],
      required: [true, "Answers are required"],
    },
  },
  { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answers: {
      type: [String],
      required: [true, "Answers are required"],
    },
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },

    focus_areas: {
      type: [String],
      required: [true, "Focus areas are required"],
    },

    tasks: {
      type: [String],
      required: [true, "Tasks are required"],
    },
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    job_description: {
      type: String,
      required: [true, "Job description is required"],
    },

    resume: {
      type: String,
      required: [true, "Resume is required"],
    },

    self_description: {
      type: String,
      required: [true, "Self description is required"],
    },

    match_Score: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, "Match score is required"],
    },

    technical_questions: {
      type: [technicalQuestionSchema],
      required: true,
    },

    behavioral_questions: {
      type: [behavioralQuestionSchema],
      required: true,
    },

    skill_gaps: {
      type: [skillGapSchema],
      required: true,
    },

    preparation_plans: {
      type: [preparationPlanSchema],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);