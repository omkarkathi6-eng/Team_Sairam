"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Target,
  Award,
  Lightbulb,
  Rocket,
  TrendingUp,
} from "lucide-react";
import ScoreCard from "@/components/ScoreCard";

export default function ProfileActualEvaluation({
  actualResults,
  setShowActualEvaluation,
  setShowUpdatedResult, // New prop for showing ProfileEvaluation.jsx
}) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Actual Evaluation Report</h1>
          <p className="text-muted-foreground mt-2">
            Real-time analysis of your updated profile evaluation based on the
            Mock Assessment
          </p>
        </div>
        <div className="flex gap-3">
          {/* Updated Result Button */}
          <Button
            className="text-white rounded-md px-6 py-2 font-medium"
            style={{ backgroundColor: "#112233", border: "none" }}
            onClick={() => {
              setShowActualEvaluation(false);
              setShowUpdatedResult(true);
            }}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Detailed analysis
          </Button>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setShowActualEvaluation(false)}
            className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
      </div>

      {/* Score Cards - Now showing all 4 scores */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          [
            "Qualification",
            "#8b5cf6",
            actualResults?.scores?.qualification_score,
          ],
          ["Soft Skills", "#f59e0b", actualResults?.scores?.soft_skills_score],
          ["Skills", "#10b981", actualResults?.scores?.skill_score],
          ["Overall Profile", "#3b82f6", actualResults?.scores?.profile_score],
        ].map(([label, color, score]) => (
          <ScoreCard
            key={label}
            label={`${label} Score`}
            score={score || 0}
            color={color}
          />
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Gap Analysis
              </CardTitle>
              <CardDescription>
                Strengths and areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">
                    Strengths:
                  </h4>
                  {actualResults?.gap_analysis?.strengths?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {actualResults.gap_analysis.strengths.map(
                        (strength, idx) => (
                          <li key={idx} className="text-sm">
                            {strength}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No strengths identified
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">
                    Areas for Improvement:
                  </h4>
                  {actualResults?.gap_analysis?.weaknesses?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {actualResults.gap_analysis.weaknesses.map(
                        (weakness, idx) => (
                          <li key={idx} className="text-sm">
                            {weakness}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No areas for improvement identified
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-blue-500" />
                Recommendations
              </CardTitle>
              <CardDescription>
                Actionable suggestions to boost your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actualResults?.recommendations?.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {actualResults.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm">
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No recommendations available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Learning Path
              </CardTitle>
              <CardDescription>
                Suggested roadmap for skills improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actualResults?.learning_path?.length > 0 ? (
                <ol className="list-decimal list-inside space-y-2">
                  {actualResults.learning_path.map((lp, idx) => (
                    <li key={idx} className="text-sm">
                      {lp}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">
                  No learning path available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Immediate Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-green-500" />
                Immediate Actions
              </CardTitle>
              <CardDescription>
                Quick wins to implement right away
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actualResults?.immediate_actions?.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {actualResults.immediate_actions.map((action, idx) => (
                    <li key={idx} className="text-sm">
                      {action}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No immediate actions available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Long-Term Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-500" />
                Long-Term Goals
              </CardTitle>
              <CardDescription>
                Strategic objectives for sustainable growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actualResults?.long_term_goals?.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {actualResults.long_term_goals.map((goal, idx) => (
                    <li key={idx} className="text-sm">
                      {goal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No long-term goals available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
