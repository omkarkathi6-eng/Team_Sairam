import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
export default function ProfileEvaluation({
  evaluationData,
  setShowEvaluation,
}) {
  return (
    // ---------------- ACTUAL EVALUATION ----------------
    <div className="mt-6 p-6 border rounded-lg shadow bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Actual Evaluation Report
        </h2>

        {/* Back Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowEvaluation(false)}
            className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
        </div>
      </div>

      {/* Overall Score & Assessment */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Overall Score</h3>
        <p className="text-xl text-blue-600 font-bold">
          {evaluationData.overall_score?.toFixed(2)}%
        </p>
        <p className="text-gray-600">
          {evaluationData.overall_assessment?.summary}
        </p>
        <p className="text-sm text-gray-500">
          Level: {evaluationData.overall_assessment?.level} | Score:{" "}
          {evaluationData.overall_assessment?.score}
        </p>
      </div>

      {/* Skill Summary */}
      {evaluationData.skill_summary && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Skill Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(evaluationData.skill_summary).map(
              ([skill, details]) => (
                <div
                  key={skill}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <h4 className="text-lg font-semibold text-gray-700">
                    {skill}
                  </h4>
                  {details.score !== undefined && (
                    <p>Score: {details.score}%</p>
                  )}
                  {details.level && <p>Level: {details.level}</p>}

                  {/* Strengths */}
                  {details.strengths?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-green-600">Strengths:</p>
                      <ul className="list-disc ml-5 text-sm">
                        {details.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {details.weaknesses?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-yellow-600">Weaknesses:</p>
                      <ul className="list-disc ml-5 text-sm">
                        {details.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {details.recommendations?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-blue-600">
                        Recommendations:
                      </p>
                      <ul className="list-disc ml-5 text-sm">
                        {details.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.code_performance && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>Code Performance:</strong>{" "}
                      {details.code_performance}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Per-question Breakdown */}
      {evaluationData.skill_breakdown &&
        Object.entries(evaluationData.skill_breakdown).map(
          ([skill, details]) => (
            <div
              key={skill}
              className="mt-8 p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-2">
                {skill} – Questions
              </h3>
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Question</th>
                    <th className="p-2 border">Your Answer</th>
                    <th className="p-2 border">Correct Answer</th>
                    <th className="p-2 border">Correct?</th>
                  </tr>
                </thead>
                <tbody>
                  {details.questions?.map((q, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{q.question}</td>
                      <td className="p-2 border">{q.user_answer}</td>
                      <td className="p-2 border">{q.correct_answer}</td>
                      <td className="p-2 border">
                        {q.is_correct ? "✅" : "❌"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      {/* Global Sections */}
      {evaluationData.strengths?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-green-700">
            Overall Strengths
          </h3>
          <ul className="list-disc ml-5 text-sm">
            {evaluationData.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluationData.weaknesses?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-yellow-700">
            Overall Weaknesses
          </h3>
          <ul className="list-disc ml-5 text-sm">
            {evaluationData.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluationData.recommendations?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-blue-700">
            Overall Recommendations
          </h3>
          <ul className="list-disc ml-5 text-sm">
            {evaluationData.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning Path */}
      {evaluationData.learning_path?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Learning Path</h3>
          <ul className="list-disc ml-5 text-sm">
            {evaluationData.learning_path.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Immediate Actions */}
      {evaluationData.immediate_actions?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-red-600">
            Immediate Actions
          </h3>
          <ul className="list-disc ml-5 text-sm">
            {evaluationData.immediate_actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Long-Term Goals */}
      {evaluationData.long_term_goals?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-purple-600">
            Long-Term Goals
          </h3>
          <ul className="list-disc ml-5 text-sm">
            {evaluationData.long_term_goals.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
