"use client";
import { useState } from "react";
import ResultBox from "./ResultBox";

const JDForm = () => {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [interviewDetails, setInterviewDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) {
      alert("Please enter a job description");
      return;
    }

    setLoading(true);
    setProgress(0);
    setResult("");
    setError("");
    setStatusMessage("");

    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += 1;
      if (progressValue < 99) setProgress(progressValue);
    }, 30);
    console.log("submitted");

    try {
      const response = await fetch("https://www.jobraze.in/api/jd/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_text: jdText }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.response);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!assignedBy.trim()) {
      alert("Please enter the name in 'Assigned By'");
      return;
    }
    if (!result.trim()) {
      alert("No questions to save. Please generate questions first.");
      return;
    }

    setStatusMessage("Saving...");
    try {
      const response = await fetch(
        "https://www.jobraze.in/api/jd/save_interview_questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jd: jdText,
            questions: result.split("\n"),
            assigned_by: assignedBy,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatusMessage(
          data.message || "Interview questions saved successfully!"
        );
      } else {
        setStatusMessage(data.error || "Failed to save interview questions.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setStatusMessage("Failed to connect to the server for saving.");
    }
  };

  const handleSendMail = async () => {
    if (!email.trim()) {
      alert("Please enter the candidate's Gmail ID");
      return;
    }
    if (!assignedBy.trim()) {
      alert("Please enter your name in 'Assigned By' field");
      return;
    }
    if (!result.trim()) {
      alert("No questions to send. Please generate questions first.");
      return;
    }

    setStatusMessage("Sending email...");
    setInterviewDetails(null);

    try {
      const response = await fetch("https://www.jobraze.in/api/jd/send_mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd: jdText,
          questions: result.split("\n"),
          to_email: email,
          assigned_by: assignedBy,
          company_name: companyName || "Your Company Name",
          contact_email: contactEmail || "support@yourcompany.com",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage(data.message || "Mail sent successfully!");
        // Save interview details for display
        if (data.interview_id && data.interview_url) {
          setInterviewDetails({
            id: data.interview_id,
            url: data.interview_url,
            email: email,
          });
        }
      } else {
        setStatusMessage(data.error || "Failed to send email.");
      }
    } catch (error) {
      console.error("Email error:", error);
      setStatusMessage("Failed to connect to the server for sending email.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-12 bg-gradient-to-br  rounded-4xl shadow-3xl space-y-10   transform transition-all duration-500 hover:scale-[1.005]"
    >
      <h1 className="text-5xl font-extrabold text-center  tracking-tight drop-shadow-xl animate-fade-in-down">
        AI-Powered Interview Question Generator
      </h1>

      <p className="text-xl text-center text-gray-600 font-medium">
        Simply paste a job description below, and let our AI craft tailored
        interview questions for you.
      </p>

      <div>
        <label
          htmlFor="jdText"
          className="block mb-4 text-2xl font-bold animate-slide-in-left"
        >
          Paste Job Description Here:
        </label>
        <textarea
          id="jdText"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="e.g., 'We are seeking a highly motivated Software Engineer to join our innovative team. The ideal candidate will have expertise in Python, data structures, and cloud platforms like AWS or Azure. Experience with agile methodologies and a passion for solving complex problems are a plus.'"
          required
          rows={9}
          // Changed placeholder text size and weight for better visibility
          className="w-full p-6 rounded-2xl border focus:ring-6 resize-y text-lg font-medium text-gray-800 placeholder:text-xl placeholder:font-semibold shadow-lg transition duration-500 transform focus:scale-[1.01] "
          style={{ minHeight: "150px" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-5 rounded-3xl font-extrabold text-white text-xl shadow-xl transition duration-500 transform hover:-translate-y-1 hover:scale-105 active:scale-95 ${
          loading
            ? "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 cursor-not-allowed"
            : "bg-black"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-4">
            <svg
              className="w-7 h-7 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Generating Insightful Questions...
          </div>
        ) : (
          "Generate Interview Questions"
        )}
      </button>

      <ResultBox result={result} error={error} />

      {result && (
        <div className="bg-white p-10 rounded-3xl  space-y-8 animate-fade-in-up">
          <p className="text-xl font-bold text-gray-700">
            Actions for Generated Questions:
          </p>

          <div>
            <label
              htmlFor="assignedBy"
              className="block mb-2 text-xl font-bold "
            >
              Assigned By:
            </label>
            <input
              id="assignedBy"
              type="text"
              value={assignedBy}
              placeholder="Your Name (e.g., John Doe)"
              onChange={(e) => setAssignedBy(e.target.value)}
              // Changed placeholder text size and weight for better visibility
              className="w-full px-7 py-5 rounded-xl border-3  focus:outline-none focus:ring-5  text-gray-900 placeholder:text-lg placeholder:font-medium  shadow-md transition duration-300 "
            />
          </div>

          <div>
            <label
              htmlFor="interviewerEmail"
              className="block mb-2 text-xl font-bold "
            >
              Candidate's Gmail ID:
            </label>
            <input
              id="interviewerEmail"
              type="email"
              value={email}
              placeholder="e.g., candidate@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-7 py-5 rounded-xl border-3  focus:outline-none focus:ring-5  text-gray-900 placeholder:text-lg placeholder:font-medium  shadow-md transition duration-300 "
            />
          </div>

          <div>
            <label
              htmlFor="companyName"
              className="block mb-2 text-xl font-bold "
            >
              Company Name:
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              placeholder="e.g., Acme Corporation"
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-7 py-5 rounded-xl border-3  focus:outline-none focus:ring-5  text-gray-900 placeholder:text-lg placeholder:font-medium  shadow-md transition duration-300 "
            />
          </div>

          <div>
            <label
              htmlFor="contactEmail"
              className="block mb-2 text-xl font-bold "
            >
              Contact Email (for support):
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              placeholder="e.g., support@yourcompany.com"
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-7 py-5 rounded-xl border-3  focus:outline-none focus:ring-5  text-gray-900 placeholder:text-lg placeholder:font-medium  shadow-md transition duration-300 "
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              type="button"
              onClick={handleSave}
              className="flex-grow bg-black text-white font-extrabold rounded-3xl py-5 shadow-lg transition duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
            >
              Save Questions
            </button>
            <button
              type="button"
              onClick={handleSendMail}
              className="flex-grow text-black border font-extrabold rounded-3xl py-5 shadow-lg transition duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
            >
              Send via Email
            </button>
          </div>

          {statusMessage && (
            <p
              className={`text-xl font-semibold text-center mt-4 ${
                statusMessage.includes("success")
                  ? "text-black-700"
                  : "text-neon-coral"
              } animate-fade-in-up`}
            >
              {statusMessage}
            </p>
          )}

          {interviewDetails && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-300 rounded-2xl shadow-md animate-fade-in-up">
              <h3 className="text-xl font-bold mb-3">Interview Details</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Interview Link:</span>{" "}
                {interviewDetails.url}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Username:</span>{" "}
                {interviewDetails.email}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Password:</span>{" "}
                <em>(Sent to candidate's email)</em>
              </p>
              <div className="flex justify-center">
                <div
                  onClick={() =>
                    navigator.clipboard.writeText(interviewDetails.url)
                  }
                  className="bg-neon-coral text-white hover:bg-electric-orange font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  Copy Interview Link
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default JDForm;
