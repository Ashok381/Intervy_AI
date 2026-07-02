import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import "./Home.css";
import { InfoContext } from "../App";

const Home = () => {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();

    const [report, setReport] = useState(null);
    const showInfo = useContext(InfoContext)

    async function handlereport(data) {
        try {
            const formData = new FormData();

            formData.append("job_description", data.job_description);
            formData.append("self_description", data.self_description);
            formData.append("resume", data.resumeFile[0]);

            const response = await fetch(
                "http://localhost:3000/api/interview/get-interviewReport",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }
            localStorage.setItem("data", JSON.stringify(result.data))
            setReport(result.data);
        } catch (error) {
            console.error(error);
            showInfo(error.message || "Something went wrong while generating the report");
        }
    }

    async function downloadResume(data) {
        try {
            const formData = new FormData();

            formData.append("job_description", data.job_description);
            formData.append("self_description", data.self_description);
            formData.append("resume", data.resumeFile[0]);

            const response = await fetch(
                "http://localhost:3000/api/interview/generate-resume",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );
            if (!response.ok) {
                throw new Error("Something went wrong while generating the resume");
            }
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Interview_Report.pdf";
            a.click();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            showInfo(error.message || "Something went wrong while downloading the resume");
        }
    }

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem("data"))
            if (data) {
                setReport(data)
            }
        } catch (err) {
            console.error(err)
            showInfo("Could not load your saved report")
        }
    }, []);

    return (
        <div className="home_container">
            <div className="form_card">
                <h2>AI Interview Report</h2>

                <form onSubmit={handleSubmit(handlereport)}>
                    <label>Upload Resume (PDF)</label>

                    <input
                        type="file"
                        accept=".pdf"
                        disabled={isSubmitting}
                        {...register("resumeFile", {
                            required: true,
                        })}
                    />

                    <label>Job Description</label>

                    <textarea
                        rows="8"
                        placeholder="Paste Job Description..."
                        disabled={isSubmitting}
                        {...register("job_description", {
                            required: true,
                        })}
                    />

                    <label>Self Description</label>

                    <textarea
                        rows="8"
                        placeholder="Tell AI about yourself..."
                        disabled={isSubmitting}
                        {...register("self_description", {
                            required: true,
                        })}
                    />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Generating Report..."
                            : "Generate Report"}
                    </button>
                    <button type="button" disabled={isSubmitting} onClick={handleSubmit(downloadResume)}>
                        {isSubmitting
                            ? "Generating Resume..."
                            : "Download Resume"}
                    </button>
                </form>
            </div>

            <div className="response_screen">
                {isSubmitting ? (
                    <div className="loading_container">
                        <div className="loader"></div>

                        <h2>AI is analyzing your resume...</h2>

                        <p>This may take 1-2 minutes.</p>
                    </div>
                ) : report ? (
                    <div className="report">
                        <h1>Interview Report</h1>

                        <div className="score">
                            <h3>Match Score</h3>
                            <h1>{report.match_Score}%</h1>
                        </div>

                        {/* Skill Gaps */}

                        <section>
                            <h2>Skill Gaps</h2>

                            {report?.skill_gaps?.map((item, index) => (
                                <div className="gap" key={index}>
                                    <b>{item.skill}</b>

                                    <span>{item.severity}</span>
                                </div>
                            ))}
                        </section>

                        {/* Technical Questions */}

                        <section>
                            <h2>Technical Questions</h2>

                            {report?.technical_questions?.map((q, index) => (
                                <div
                                    className="question_card"
                                    key={index}
                                >
                                    <h3>{q.question}</h3>

                                    <p>
                                        <strong>Purpose:</strong>{" "}
                                        {q.intention}
                                    </p>

                                    <h4>Suggested Answer</h4>

                                    <ul>
                                        {q.answers.map((answer, i) => (
                                            <li key={i}>{answer}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* Behavioral Questions */}

                        <section>
                            <h2>Behavioral Questions</h2>

                            {report?.behavioral_questions?.map(
                                (q, index) => (
                                    <div
                                        className="question_card"
                                        key={index}
                                    >
                                        <h3>{q.question}</h3>

                                        <p>
                                            <strong>Purpose:</strong>{" "}
                                            {q.intention}
                                        </p>

                                        <h4>Suggested Answer</h4>

                                        <ul>
                                            {q.answers.map(
                                                (answer, i) => (
                                                    <li key={i}>
                                                        {answer}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )
                            )}
                        </section>

                        {/* Preparation Plan */}

                        <section>
                            <h2>5-Day Preparation Plan</h2>

                            {report?.preparation_plans?.map(
                                (plan, index) => (
                                    <div
                                        className="plan_card"
                                        key={index}
                                    >
                                        <h3>
                                            Day {plan.day}
                                        </h3>

                                        <h4>Focus Areas</h4>

                                        <ul>
                                            {plan.focus_areas.map(
                                                (area, i) => (
                                                    <li key={i}>
                                                        {area}
                                                    </li>
                                                )
                                            )}
                                        </ul>

                                        <h4>Tasks</h4>

                                        <ul>
                                            {plan.tasks.map(
                                                (task, i) => (
                                                    <li key={i}>
                                                        {task}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )
                            )}
                        </section>
                    </div>
                ) : (
                    <div className="empty_state">
                        <h2>Interview Report</h2>

                        <p>
                            Upload your resume and click{" "}
                            <strong>
                                Generate Report
                            </strong>{" "}
                            to receive your AI-powered interview
                            analysis.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
