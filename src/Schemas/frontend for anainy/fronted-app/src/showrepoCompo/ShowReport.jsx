import React from "react";
import './ShowReport.css'
const ShowReport = ({ item }) => {
  if (!item) {
    return <h2>No Report Selected</h2>;
  }

  return (
    <div className="report">

      <h1>Interview Report</h1>

      {/* Match Score */}
      <section>
        <h2>Match Score</h2>
        <h3>{item.match_Score}/100</h3>
      </section>

      <hr />

      {/* Job Description */}
      <section>
        <h2>Job Description</h2>
        <pre>{item.job_description}</pre>
      </section>

      <hr />

      {/* Self Description */}
      <section>
        <h2>Self Description</h2>
        <pre>{item.self_description}</pre>
      </section>

      <hr />

      {/* Resume */}
      <section>
        <h2>Resume</h2>
        <pre>{item.resume}</pre>
      </section>

      <hr />

      {/* Technical Questions */}
      <section>
        <h2>Technical Questions</h2>

        {item.technical_questions.map((question, index) => (
          <div key={index} className="questionCard">

            <h3>Question {index + 1}</h3>

            <p>
              <strong>Question:</strong>
            </p>

            <p>{question.question}</p>

            <p>
              <strong>Purpose:</strong>
            </p>

            <p>{question.intention}</p>

            <strong>Suggested Answers</strong>

            <ul>
              {question.answers.map((answer, i) => (
                <li key={i}>{answer}</li>
              ))}
            </ul>

          </div>
        ))}
      </section>

      <hr />

      {/* Behavioral Questions */}
      <section>
        <h2>Behavioral Questions</h2>

        {item.behavioral_questions.map((question, index) => (
          <div key={index} className="questionCard">

            <h3>Question {index + 1}</h3>

            <p>
              <strong>Question:</strong>
            </p>

            <p>{question.question}</p>

            <p>
              <strong>Purpose:</strong>
            </p>

            <p>{question.intention}</p>

            <strong>Suggested Answers</strong>

            <ul>
              {question.answers.map((answer, i) => (
                <li key={i}>{answer}</li>
              ))}
            </ul>

          </div>
        ))}
      </section>

      <hr />

      {/* Skill Gaps */}
      <section>
        <h2>Skill Gaps</h2>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {item.skill_gaps.map((skill, index) => (
              <tr key={index}>
                <td>{skill.skill}</td>
                <td>{skill.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr />

      {/* Preparation Plan */}
      <section>
        <h2>Preparation Plan</h2>

        {item.preparation_plans.map((plan) => (
          <div key={plan.day} className="planCard">

            <h3>Day {plan.day}</h3>

            <h4>Focus Areas</h4>

            <ul>
              {plan.focus_areas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>

            <h4>Tasks</h4>

            <ul>
              {plan.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>

          </div>
        ))}
      </section>

    </div>
  );
};

export default ShowReport;
