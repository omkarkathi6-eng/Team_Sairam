import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  Star,
  Download,
  Share2,
  ArrowLeft,
  MessageSquare,
  Code,
  User,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Brain,
  TrendingUp,
  Target,
  AlertTriangle,
  Trophy,
  BookOpen,
  Lightbulb,
} from "lucide-react";

export default function ResultsStep({
  evaluationResults,
  onBack,
  onDownload,
  onShare,
  questions,
  responses,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!evaluationResults) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Evaluation In Progress</h2>
        <p className="text-gray-600 mb-6">
          Our AI system is analyzing your interview responses. This may take a
          few moments.
        </p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    );
  }

  // Handle evaluation errors
  if (evaluationResults.hasError || evaluationResults.status === "error") {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-600">
          Evaluation Error
        </h2>
        <p className="text-gray-600 mb-6">
          {evaluationResults.feedback ||
            evaluationResults.message ||
            "There was an issue processing your interview evaluation."}
        </p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Try Again
        </Button>
      </div>
    );
  }

  // Extract data from backend response structure
  const {
    overallScore = 0,
    feedback = "",
    areasForImprovement = [],
    keyStrengths = [],
    questionFeedback = [],
    communicationScore = 0,
    technicalScore = 0,
    confidenceScore = 0,
    detailedScores = {},
    nextSteps = [],
    interviewMetrics = {},
  } = evaluationResults;

  const totalQuestions = questions?.length || 0;
  const answeredQuestions =
    responses?.filter((r) => r.answer && r.answer.trim().length > 0).length ||
    0;

  const currentFeedback = questionFeedback[currentQuestionIndex] || {};
  const currentQuestion = questions?.[currentQuestionIndex];
  const currentResponse = responses?.[currentQuestionIndex];

  const renderScoreBadge = (score) => {
    if (score >= 80) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Excellent
        </Badge>
      );
    } else if (score >= 60) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Good
        </Badge>
      );
    } else if (score >= 40) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Average
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Needs Improvement
        </Badge>
      );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="-ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          {/* <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button> */}
        </div>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Interview Evaluation
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis powered by advanced AI
          </p>
        </div>

        {/* Main Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Overall Score
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <div
                  className={`text-3xl font-bold ${getScoreColor(
                    overallScore
                  )}`}
                >
                  {overallScore}%
                </div>
                <div className="mt-1">{renderScoreBadge(overallScore)}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={overallScore} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Communication
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    communicationScore
                  )}`}
                >
                  {communicationScore}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={communicationScore} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Technical
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Code className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    technicalScore
                  )}`}
                >
                  {technicalScore}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={technicalScore} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Confidence
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    confidenceScore
                  )}`}
                >
                  {confidenceScore}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={confidenceScore} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback">Questions</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="improve">Improve</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Analysis Summary
                </CardTitle>
                <CardDescription>
                  Comprehensive evaluation of your interview performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700">
                    {feedback}
                  </p>
                </div>

                {/* Key Strengths */}
                {keyStrengths.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Key Strengths Identified
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {keyStrengths.map((strength, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 font-medium">
                            {strength}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Areas for Improvement */}
                {areasForImprovement.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-amber-600" />
                      Areas for Improvement
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {areasForImprovement.map((area, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200"
                        >
                          <Target className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-amber-800 font-medium">
                            {area}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Score Breakdown */}
                {Object.keys(detailedScores).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Detailed Score Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(detailedScores).map(
                        ([category, score]) => (
                          <div
                            key={category}
                            className="space-y-2 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium capitalize text-gray-700">
                                {category}
                              </span>
                              <span
                                className={`text-sm font-bold ${getScoreColor(
                                  score
                                )}`}
                              >
                                {score}%
                              </span>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {nextSteps.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      Recommended Next Steps
                    </h3>
                    <div className="space-y-2">
                      {nextSteps.map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800 mt-0.5">
                            {i + 1}
                          </div>
                          <span className="text-blue-800">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  AI Question Analysis
                </CardTitle>
                <CardDescription>
                  Detailed AI feedback for each interview question (
                  {questionFeedback.length} questions analyzed)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentQuestionIndex(
                            Math.max(0, currentQuestionIndex - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentQuestionIndex(
                            Math.min(
                              totalQuestions - 1,
                              currentQuestionIndex + 1
                            )
                          )
                        }
                        disabled={currentQuestionIndex === totalQuestions - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Question {currentQuestionIndex + 1}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {currentQuestion?.type || "general"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {currentQuestion?.difficulty || "medium"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        {currentQuestion?.text ||
                          currentQuestion?.question ||
                          "No question available"}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Your Response
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="whitespace-pre-line text-gray-700">
                            {currentResponse?.answer || "No response provided"}
                          </p>
                        </div>
                        {currentResponse?.answer && (
                          <div className="mt-2 text-xs text-gray-500">
                            Word count:{" "}
                            {
                              currentResponse.answer
                                .split(" ")
                                .filter((w) => w.trim()).length
                            }{" "}
                            words
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Evaluation
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-white border rounded-lg">
                            {(currentFeedback?.score || 0) >= 3 ? (
                              <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <ThumbsDown className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-medium">
                                  Score: {currentFeedback?.score || 0}/5
                                </p>
                                {renderScoreBadge(
                                  (currentFeedback?.score || 0) * 20
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {currentFeedback?.feedback ||
                                  "No detailed feedback available for this response."}
                              </p>
                            </div>
                          </div>

                          {/* AI-generated suggested improvement */}
                          {currentFeedback?.suggestedAnswer && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h5 className="font-medium text-sm text-blue-800 mb-2 flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                AI Improvement Suggestion
                              </h5>
                              <p className="text-sm text-blue-700 leading-relaxed">
                                {currentFeedback.suggestedAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Question metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">
                            Response Time
                          </p>
                          <p className="font-medium">
                            {currentResponse?.time_taken
                              ? `${Math.ceil(
                                  currentResponse.time_taken / 60
                                )}m ${Math.round(
                                  currentResponse.time_taken % 60
                                )}s`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">AI Score</p>
                          <p className="font-medium">
                            {currentFeedback?.score
                              ? `${currentFeedback.score}/5`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Keywords</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {currentFeedback?.keywordsMatched?.length ? (
                              currentFeedback.keywordsMatched
                                .slice(0, 3)
                                .map((kw, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {kw}
                                  </Badge>
                                ))
                            ) : (
                              <span className="text-sm">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Complete Interview Transcript
                </CardTitle>
                <CardDescription>
                  Full record of your interview responses with AI scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions?.map((q, i) => {
                    const response = responses?.[i];
                    const feedback = questionFeedback[i];
                    return (
                      <div
                        key={i}
                        className="space-y-4 border-b border-gray-100 pb-6 last:border-b-0"
                      >
                        {/* Question */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-bold text-blue-600">
                              {i + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">Interviewer</p>
                              <Badge variant="outline" className="text-xs">
                                {q.type || "general"}
                              </Badge>
                            </div>
                            <p className="text-gray-800">
                              {q.text || q.question}
                            </p>
                          </div>
                        </div>

                        {/* Response */}
                        <div className="flex items-start gap-3 ml-11">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium">Your Response</p>
                              {feedback?.score && (
                                <Badge
                                  variant={
                                    feedback.score >= 3
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  AI Score: {feedback.score}/5
                                </Badge>
                              )}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                {response?.answer || "No response provided"}
                              </p>
                            </div>
                            {response?.time_taken && (
                              <p className="text-xs text-gray-500 mt-2">
                                Response time: {Math.round(response.time_taken)}
                                s
                              </p>
                            )}
                          </div>
                        </div>

                        {/* AI Feedback for this question */}
                        {feedback?.feedback && (
                          <div className="ml-11 mt-3">
                            <Alert className="bg-blue-50 border-blue-200">
                              <Brain className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-800">
                                <strong>AI Feedback:</strong>{" "}
                                {feedback.feedback}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Interview Summary Metrics */}
                {Object.keys(interviewMetrics).length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Interview Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {interviewMetrics.averageResponseTime && (
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Avg Response Time
                          </p>
                          <p className="text-xl font-semibold text-blue-600">
                            {interviewMetrics.averageResponseTime} min
                          </p>
                        </div>
                      )}
                      {interviewMetrics.responseCompleteness !== undefined && (
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Completion Rate
                          </p>
                          <p className="text-xl font-semibold text-green-600">
                            {Math.round(interviewMetrics.responseCompleteness)}%
                          </p>
                        </div>
                      )}
                      {interviewMetrics.totalWordsSpoken && (
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Words</p>
                          <p className="text-xl font-semibold text-purple-600">
                            {interviewMetrics.totalWordsSpoken}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Improvement Tab */}
          <TabsContent value="improve">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Improvement Areas */}
              {areasForImprovement.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-amber-600" />
                      Focus Areas
                    </CardTitle>
                    <CardDescription>
                      Areas identified by AI for improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {areasForImprovement.map((area, i) => (
                        <div
                          key={i}
                          className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800 mt-0.5 flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-amber-800 font-medium">{area}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Steps */}
              {nextSteps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      Action Plan
                    </CardTitle>
                    <CardDescription>
                      AI-recommended steps for development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {nextSteps.map((step, i) => (
                        <div
                          key={i}
                          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800 mt-0.5 flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-blue-800 font-medium">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    AI-analyzed interview performance data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Overall Performance</span>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            overallScore
                          )}`}
                        >
                          {overallScore}%
                        </p>
                        {renderScoreBadge(overallScore)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Communication Skills</span>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            communicationScore
                          )}`}
                        >
                          {communicationScore}%
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Technical Competency</span>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            technicalScore
                          )}`}
                        >
                          {technicalScore}%
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Confidence Level</span>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            confidenceScore
                          )}`}
                        >
                          {confidenceScore}%
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Questions Completed</span>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {answeredQuestions}/{totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600">
                          {Math.round(
                            (answeredQuestions / totalQuestions) * 100
                          )}
                          % completion
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interview Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Interview Statistics
                  </CardTitle>
                  <CardDescription>Time and response analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interviewMetrics.averageResponseTime && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Average Response Time</span>
                      <p className="text-lg font-bold text-blue-600">
                        {interviewMetrics.averageResponseTime} min
                      </p>
                    </div>
                  )}

                  {interviewMetrics.totalWordsSpoken && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Words Spoken</span>
                      <p className="text-lg font-bold text-purple-600">
                        {interviewMetrics.totalWordsSpoken}
                      </p>
                    </div>
                  )}

                  {interviewMetrics.responseCompleteness !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Response Completeness</span>
                      <p className="text-lg font-bold text-green-600">
                        {Math.round(interviewMetrics.responseCompleteness)}%
                      </p>
                    </div>
                  )}

                  {/* Question type breakdown */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Question Type Performance</h4>
                    {questionFeedback.length > 0 && (
                      <div className="space-y-2">
                        {["technical", "behavioral", "general"].map((type) => {
                          const typeQuestions = questionFeedback.filter(
                            (_, i) => questions?.[i]?.type === type
                          );
                          if (typeQuestions.length === 0) return null;

                          const avgScore =
                            typeQuestions.reduce(
                              (sum, q) => sum + (q.score || 0),
                              0
                            ) / typeQuestions.length;

                          return (
                            <div
                              key={type}
                              className="flex justify-between items-center p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm font-medium capitalize">
                                {type}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {avgScore.toFixed(1)}/5
                                </span>
                                <Progress
                                  value={avgScore * 20}
                                  className="w-16 h-2"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
          <Button onClick={onDownload} size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Download Detailed Report
          </Button>
          {/* <Button
            variant="outline"
            onClick={onShare}
            size="lg"
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Your Results
          </Button> */}
        </div>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   CheckCircle,
//   Clock,
//   Star,
//   Download,
//   Share2,
//   ArrowLeft,
//   MessageSquare,
//   Code,
//   User,
//   Volume2,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";

// export default function ResultsStep({
//   evaluationResults,
//   onBack,
//   onDownload,
//   onShare,
//   questions,
//   responses,
// }) {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   if (!evaluationResults) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
//           <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
//         </div>
//         <h2 className="text-2xl font-bold mb-2">Evaluation In Progress</h2>
//         <p className="text-gray-600 mb-6">
//           We're still analyzing your interview. This may take a few minutes.
//         </p>
//         <Button variant="outline" onClick={onBack}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Dashboard
//         </Button>
//       </div>
//     );
//   }

//   const {
//     overallScore,
//     feedback,
//     areasForImprovement = [],
//     questionFeedback = [],
//     communicationScore,
//     technicalScore,
//     confidenceScore,
//     totalQuestions = questions?.length || 0,
//     answeredQuestions = responses?.filter((r) => r.answer.trim().length > 0)
//       .length || 0,
//   } = evaluationResults;

//   const currentFeedback = questionFeedback[currentQuestionIndex] || {};
//   const currentQuestion = questions?.[currentQuestionIndex];
//   const currentResponse = responses?.[currentQuestionIndex];

//   const renderScoreBadge = (score) => {
//     if (score >= 80) {
//       return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
//     } else if (score >= 60) {
//       return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
//     } else if (score >= 40) {
//       return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
//     } else {
//       return (
//         <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
//       );
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" onClick={onBack} className="-ml-2">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <div className="flex space-x-2">
//           <Button variant="outline" size="sm" onClick={onDownload}>
//             <Download className="mr-2 h-4 w-4" />
//             Download
//           </Button>
//           <Button variant="outline" size="sm" onClick={onShare}>
//             <Share2 className="mr-2 h-4 w-4" />
//             Share
//           </Button>
//         </div>
//       </div>

//       <div className="space-y-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight">
//             Interview Results
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Review your performance and feedback
//           </p>
//         </div>

//         {/* Score Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-gray-500">
//                   Overall Score
//                 </CardTitle>
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                   <Star className="h-5 w-5 text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <div className="text-3xl font-bold">{overallScore}%</div>
//                 <div className="mt-1">{renderScoreBadge(overallScore)}</div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Progress value={overallScore} className="h-2" />
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-gray-500">
//                   Communication
//                 </CardTitle>
//                 <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
//                   <Volume2 className="h-5 w-5 text-purple-600" />
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <div className="text-2xl font-bold">{communicationScore}%</div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Progress value={communicationScore} className="h-2" />
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-gray-500">
//                   Technical
//                 </CardTitle>
//                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
//                   <Code className="h-5 w-5 text-green-600" />
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <div className="text-2xl font-bold">{technicalScore}%</div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Progress value={technicalScore} className="h-2" />
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-gray-500">
//                   Questions
//                 </CardTitle>
//                 <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
//                   <MessageSquare className="h-5 w-5 text-orange-600" />
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <div className="text-2xl font-bold">
//                   {answeredQuestions}/{totalQuestions}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">Questions answered</p>
//               </div>
//             </CardHeader>
//           </Card>
//         </div>

//         {/* Tabs Section */}
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-6"
//         >
//           <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-md">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="feedback">Question Feedback</TabsTrigger>
//             <TabsTrigger value="transcript">Transcript</TabsTrigger>
//             <TabsTrigger value="improve">Improvement Areas</TabsTrigger>
//           </TabsList>

//           {/* Overview */}
//           <TabsContent value="overview" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Summary</CardTitle>
//                 <CardDescription>
//                   Your overall performance and key insights
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="prose max-w-none">
//                   <p>{feedback}</p>
//                 </div>
//                 <div className="space-y-4 pt-4">
//                   <h3 className="font-medium">Key Strengths</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {[
//                       "Clear and concise communication",
//                       "Strong technical knowledge",
//                       "Good problem-solving approach",
//                       "Professional demeanor",
//                     ].map((strength, i) => (
//                       <div key={i} className="flex items-start gap-2">
//                         <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
//                         <span>{strength}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Feedback */}
//           <TabsContent value="feedback">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Question-by-Question Feedback</CardTitle>
//                 <CardDescription>
//                   Detailed feedback for each question in your interview
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-8">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-medium">
//                       Question {currentQuestionIndex + 1} of{" "}
//                       {questions?.length || 0}
//                     </h3>
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentQuestionIndex(
//                             Math.max(0, currentQuestionIndex - 1)
//                           )
//                         }
//                         disabled={currentQuestionIndex === 0}
//                       >
//                         Previous
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentQuestionIndex(
//                             Math.min(
//                               (questions?.length || 1) - 1,
//                               currentQuestionIndex + 1
//                             )
//                           )
//                         }
//                         disabled={
//                           currentQuestionIndex === (questions?.length || 1) - 1
//                         }
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>

//                   <Card>
//                     <CardHeader className="bg-gray-50">
//                       <CardTitle className="text-base">Question</CardTitle>
//                       <p>{currentQuestion?.text || "No question available"}</p>
//                     </CardHeader>
//                     <CardContent className="pt-6 space-y-6">
//                       <div>
//                         <h4 className="font-medium mb-2">Your Response</h4>
//                         <div className="bg-gray-50 p-4 rounded-md">
//                           <p className="whitespace-pre-line">
//                             {currentResponse?.answer || "No response provided"}
//                           </p>
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-medium mb-2">Feedback</h4>
//                         <div className="space-y-4">
//                           <div className="flex items-start gap-2">
//                             {currentFeedback?.score >= 3 ? (
//                               <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5" />
//                             ) : (
//                               <ThumbsDown className="h-5 w-5 text-amber-500 mt-0.5" />
//                             )}
//                             <div>
//                               <p className="font-medium">
//                                 {currentFeedback?.score >= 3
//                                   ? "Good Response"
//                                   : "Needs Improvement"}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {currentFeedback?.feedback ||
//                                   "No feedback available for this response."}
//                               </p>
//                             </div>
//                           </div>

//                           {currentFeedback?.suggestedAnswer && (
//                             <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
//                               <h5 className="font-medium text-sm text-blue-800 mb-2">
//                                 Suggested Answer
//                               </h5>
//                               <p className="text-sm text-blue-700">
//                                 {currentFeedback.suggestedAnswer}
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">
//                             Response Time
//                           </p>
//                           <p className="font-medium">
//                             {currentResponse?.timeSpent
//                               ? `${Math.ceil(
//                                   currentResponse.timeSpent / 60
//                                 )}m ${currentResponse.timeSpent % 60}s`
//                               : "N/A"}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">Score</p>
//                           <p className="font-medium">
//                             {currentFeedback?.score
//                               ? `${currentFeedback.score}/5`
//                               : "N/A"}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">
//                             Keywords Matched
//                           </p>
//                           <div className="flex flex-wrap gap-1">
//                             {currentFeedback?.keywordsMatched?.length ? (
//                               currentFeedback.keywordsMatched.map((kw, i) => (
//                                 <Badge
//                                   key={i}
//                                   variant="secondary"
//                                   className="text-xs"
//                                 >
//                                   {kw}
//                                 </Badge>
//                               ))
//                             ) : (
//                               <span className="text-sm">N/A</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Transcript */}
//           <TabsContent value="transcript">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Interview Transcript</CardTitle>
//                 <CardDescription>
//                   Complete text of your interview responses
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {questions?.map((q, i) => {
//                     const response = responses?.[i];
//                     return (
//                       <div key={i} className="space-y-2">
//                         <div className="flex items-start gap-3">
//                           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
//                             <User className="h-4 w-4 text-primary" />
//                           </div>
//                           <div>
//                             <p className="font-medium">Interviewer</p>
//                             <p className="text-gray-800">{q.text}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-start gap-3 ml-11">
//                           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
//                             <User className="h-4 w-4 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="font-medium">You</p>
//                             <p className="text-gray-800 whitespace-pre-line">
//                               {response?.answer || "No response provided"}
//                             </p>
//                             {response?.timestamp && (
//                               <p className="text-xs text-gray-500 mt-1">
//                                 {new Date(
//                                   response.timestamp
//                                 ).toLocaleTimeString()}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Improvement Areas */}
//           <TabsContent value="improve">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Improvement Areas</CardTitle>
//                 <CardDescription>
//                   Focus on these areas for your next interview
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {areasForImprovement?.length ? (
//                   <ul className="space-y-3">
//                     {areasForImprovement.map((area, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
//                         <span>{area}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <p>
//                       No specific improvement areas identified. Keep up the good
//                       work!
//                     </p>
//                   </div>
//                 )}

//                 <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-8">
//                   <h3 className="font-medium text-blue-800 mb-2">Next Steps</h3>
//                   <ul className="space-y-2 text-sm text-blue-700">
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                       <span>
//                         Review the detailed feedback for each question
//                       </span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                       <span>
//                         Practice with mock interviews to improve your responses
//                       </span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                       <span>
//                         Focus on your identified improvement areas before your
//                         next interview
//                       </span>
//                     </li>
//                   </ul>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
