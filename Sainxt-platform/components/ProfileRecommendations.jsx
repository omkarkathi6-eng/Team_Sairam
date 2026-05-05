import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScoreCard from "@/components/ScoreCard";
import PieSkillChart from "@/components/ui/PieSkillChart"; // Assuming this is used; adjust if needed
import { ChevronLeft, TrendingUp, Target, Award } from "lucide-react";

export default function ProfileRecommendations({
  aiResults,
  showResults,
  setShowDetailedRecommendations,
}) {
  const radarChartScores = {
    communication: aiResults?.scores?.soft_skills_score || 0,
    leadership: aiResults?.scores?.qualification_score || 0,
    technical: aiResults?.scores?.skill_score || 0,
    domain: aiResults?.scores?.qualification_score || 0,
    problemSolving: aiResults?.scores?.profile_score || 0,
  };

  const getLearningResource = (skill) => {
    const resources = {
      Python: "Learn Python from Coursera, W3Schools, or Codecademy.",
      NumPy: "Start with NumPy tutorials on W3Schools or DataCamp.",
      Pandas: "Explore Pandas with real-world data on Kaggle or DataCamp.",
      "scikit-learn":
        "Take scikit-learn crash courses on YouTube or Coursera’s ML specialization.",
      TensorFlow:
        "Use TensorFlow official docs and Coursera's Deep Learning AI.",
    };
    return resources[skill] || `Explore online resources to learn ${skill}.`;
  };

  // Extract [min, max] from a salary range string like "₹3–4 LPA"
  function parseSalaryRange(text) {
    if (!text) return null;
    const match = text.match(/₹?(\d+)[–-](\d+)\s*LPA/i);
    if (match) {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }
    return null;
  }

  // Convert salary range into percentage width (relative scale)
  function salaryToWidth([min, max], scaleMax = 12) {
    // scaleMax = maximum salary we want to visualize, e.g., 12 LPA
    const avg = (min + max) / 2;
    return `${Math.min((avg / scaleMax) * 100, 100)}%`;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Profile Analysis & Recommendations
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analysis of your profile with personalized
            recommendations
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowDetailedRecommendations(false)}
          className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      {/* Score Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          ["Profile", "#3b82f6"],
          ["Skill", "#10b981"],
          ["Qualification", "#3b82f6"],
          ["Soft Skills", "#f59e0b"],
        ].map(([label, color]) => (
          <div key={label} className="scorecard-label-override">
            <ScoreCard
              label={`${label} Score`}
              score={
                aiResults.scores?.[
                  `${label.toLowerCase().replace(/\s+/g, "_")}_score`
                ] || 0
              }
              color={color}
            />
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Analysis Table */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Profile Analysis Overview
              </CardTitle>
              <CardDescription>
                Strengths, areas for improvement, and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-1/4">
                        Category
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-16">
                        Status
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Strengths Section */}
                    {aiResults?.evaluation?.gap_analysis?.strengths?.length >
                      0 &&
                      aiResults.evaluation.gap_analysis.strengths.map(
                        (strength, index) => (
                          <tr
                            key={`strength-${index}`}
                            className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200"
                          >
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {index === 0 && (
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  <span className="font-semibold text-green-700 dark:text-green-300">
                                    Strengths
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto shadow-sm"></div>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              <div className="flex items-start">
                                <svg
                                  className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {strength}
                              </div>
                            </td>
                          </tr>
                        )
                      )}

                    {/* Areas for Improvement Section */}
                    {aiResults?.evaluation?.gap_analysis?.weaknesses?.length >
                      0 &&
                      aiResults.evaluation.gap_analysis.weaknesses.map(
                        (weakness, index) => (
                          <tr
                            key={`weakness-${index}`}
                            className="hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors duration-200"
                          >
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {index === 0 && (
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                  <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                                    Areas for Improvement
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto shadow-sm"></div>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              <div className="flex items-start">
                                <svg
                                  className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-1.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                                {weakness}
                              </div>
                            </td>
                          </tr>
                        )
                      )}

                    {/* Recommendations Section */}
                    {aiResults?.evaluation?.recommendations?.length > 0 &&
                      aiResults.evaluation.recommendations.map((rec, index) => (
                        <tr
                          key={`recommendation-${index}`}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                        >
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {index === 0 && (
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                  Recommendations
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto shadow-sm"></div>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-start">
                              <svg
                                className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              {typeof rec === "object"
                                ? rec.course_name ||
                                  rec.description ||
                                  "Unnamed Course"
                                : rec}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Skill Development Pathway */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Skill Development Pathway
              </CardTitle>
              <CardDescription>
                Personalized learning path based on your current skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-1/4">
                        Skill
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-20">
                        Level of Learning
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Learning Resources
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Individual Skills from Pathway */}
                    {aiResults?.evaluation?.skill_pathway?.length > 0 &&
                      aiResults.evaluation.skill_pathway
                        .filter((s) => typeof s === "string")
                        .map((skill, index) => {
                          const skillHeading = skill.includes(":")
                            ? skill.split(":")[0].trim()
                            : skill;

                          const getSkillStatus = (skillName) => {
                            const skillText = skill.toLowerCase();
                            if (
                              skillText.includes("basic") ||
                              skillText.includes("beginner") ||
                              skillText.includes("fundamental") ||
                              skillText.includes("improve")
                            ) {
                              return {
                                level: "Beginner",
                                color: "bg-red-500",
                                textColor: "text-red-700 dark:text-red-300",
                                bgColor: "bg-red-50 dark:bg-red-900/20",
                                hoverColor:
                                  "hover:bg-red-50 dark:hover:bg-red-900/10",
                              };
                            } else if (
                              skillText.includes("intermediate") ||
                              skillText.includes("moderate") ||
                              skillText.includes("developing")
                            ) {
                              return {
                                level: "Intermediate",
                                color: "bg-yellow-500",
                                textColor:
                                  "text-yellow-700 dark:text-yellow-300",
                                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                                hoverColor:
                                  "hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
                              };
                            } else {
                              return {
                                level: "Advanced",
                                color: "bg-green-500",
                                textColor: "text-green-700 dark:text-green-300",
                                bgColor: "bg-green-50 dark:bg-green-900/20",
                                hoverColor:
                                  "hover:bg-green-50 dark:hover:bg-green-900/10",
                              };
                            }
                          };

                          const skillStatus = getSkillStatus(skillHeading);

                          return (
                            <tr
                              key={`skill-${index}`}
                              className={`${skillStatus.hoverColor} transition-colors duration-200`}
                            >
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 ${skillStatus.color} rounded-full mr-3`}
                                  ></div>
                                  {skillHeading}
                                </div>
                              </td>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${skillStatus.bgColor} ${skillStatus.textColor}`}
                                >
                                  {skillStatus.level}
                                </span>
                              </td>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-start">
                                  <svg
                                    className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                  {getLearningResource &&
                                    getLearningResource(skillHeading)}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Radar Chart & Summary */}
        <div className="xl:col-span-1 space-y-6">
          {/* Remove sticky positioning to prevent overlap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Skills Overview
              </CardTitle>
              <CardDescription>
                Visual representation of your competencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pie Chart */}
                <div className="flex justify-center">
                  {aiResults && (
                    // <RadarSkillChart scores={radarChartScores} />
                    <PieSkillChart scores={radarChartScores} />
                  )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Quick Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Strengths
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {aiResults?.evaluation?.gap_analysis?.strengths
                          ?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Areas to Improve
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        {aiResults?.evaluation?.gap_analysis?.weaknesses
                          ?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Recommendations
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {aiResults?.evaluation?.recommendations?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market fitment data */}
          {aiResults?.evaluation?.market_fitment &&
            (() => {
              const summaryText = Array.isArray(
                aiResults.evaluation.market_fitment.summary
              )
                ? aiResults.evaluation.market_fitment.summary.join(" ")
                : aiResults.evaluation.market_fitment.summary;

              // Extract salary ranges dynamically
              const currentRange = parseSalaryRange(summaryText); // e.g., [3, 4]
              const futureRangeMatches = summaryText.match(
                /future.*₹?(\d+)[–-](\d+)\s*LPA/i
              );
              const futureRange = futureRangeMatches
                ? [
                    parseInt(futureRangeMatches[1], 10),
                    parseInt(futureRangeMatches[2], 10),
                  ]
                : null;

              return (
                <Card className="relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-[#33D6C4]" />
                      Market Fitment Analysis
                    </CardTitle>
                    <CardDescription>
                      Your current market readiness and positioning
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative space-y-4">
                    {/* Market Fitment Summary */}
                    <div className="space-y-3">
                      {Array.isArray(
                        aiResults.evaluation.market_fitment.summary
                      ) ? (
                        <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {aiResults.evaluation.market_fitment.summary.map(
                            (point, idx) => (
                              <li key={idx}>{point}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {aiResults.evaluation.market_fitment.summary}
                        </p>
                      )}

                      {/* Salary Potential Visualization */}
                      <div className="mt-4 space-y-4">
                        {currentRange && (
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                              Current Earning Potential
                            </h5>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-yellow-500 h-2.5 rounded-full"
                                  style={{
                                    width: salaryToWidth(currentRange),
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-yellow-600">
                                ₹{currentRange[0]}–{currentRange[1]} LPA
                              </span>
                            </div>
                          </div>
                        )}

                        {futureRange && (
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                              Future Earning Potential (Following the
                              Recommendation)
                            </h5>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-green-500 h-2.5 rounded-full"
                                  style={{
                                    width: salaryToWidth(futureRange),
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-green-600">
                                ₹{futureRange[0]}–{futureRange[1]} LPA
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
