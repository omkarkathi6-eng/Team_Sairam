import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  Loader2,
  Download,
  Share2,
  AlertCircle,
  RefreshCw,
  Brain,
} from "lucide-react";

export default function CompleteStep({
  isSubmitting,
  evaluationError,
  onViewResults,
  onDownload,
  onShare,
  onRetryEvaluation,
}) {
  // Show error state if evaluation failed
  if (evaluationError) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-red-600">
            Evaluation Error
          </h2>
          <p className="text-gray-600">
            We encountered an issue while evaluating your interview responses.
          </p>
        </div>

        <Alert className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error Details:</strong> {evaluationError}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRetryEvaluation}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Retry Evaluation
              </>
            )}
          </Button>

          <Button variant="outline" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Raw Responses
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Your interview responses have been saved. You can retry the evaluation
          or download your responses.
        </p>
      </div>
    );
  }

  // Show loading state during evaluation
  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            AI Evaluation in Progress
          </h2>
          <p className="text-gray-600">
            Our AI system is analyzing your interview responses...
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing communication patterns...
            </p>
            <p>Processing technical competency...</p>
            <p>Generating personalized feedback...</p>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-left">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            This process typically takes 1-2 minutes. Please don't close this
            window.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show success state when evaluation is complete
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Interview Evaluation Complete
        </h2>
        <p className="text-gray-600">
          Your interview has been successfully analyzed by our AI system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mx-auto mb-3">
              <Brain className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg font-medium">
              AI Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Our advanced AI has analyzed your responses, communication style,
              and technical competency.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 mx-auto mb-3">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg font-medium">
              Download Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Get a detailed PDF report with your evaluation and
              recommendations.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardContent>
        </Card>

        {/* <Card className="border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mx-auto mb-3">
              <Share2 className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg font-medium">Share Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Share your achievements with potential employers.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardContent>
        </Card> */}
      </div>

      <div className="pt-8">
        <Button size="lg" onClick={onViewResults} className="px-8">
          View Detailed Results
        </Button>

        <p className="mt-4 text-sm text-gray-500">
          Your personalized feedback and improvement recommendations are ready
          to view.
        </p>
      </div>
    </div>
  );
}
