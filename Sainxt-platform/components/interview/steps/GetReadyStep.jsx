import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function GetReadyStep({
  onStart,
  interviewDuration,
  onSessionCreated,
}) {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const minutes = Math.floor(interviewDuration / 60000); // ms → min
  const seconds = Math.floor((interviewDuration % 60000) / 1000); // leftover seconds

  useEffect(() => {
    if (isCountingDown && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && timeRemaining === 0) {
      onStart();
    }
  }, [isCountingDown, timeRemaining, onStart]);

  const startCountdown = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("No auth token found. Please log in.");
        return;
      }

      // First, create session to get session_id
      console.log("Creating interview session...");
      const sessionRes = await fetch(
        "https://www.jobraze.in/api/ai-interview/create-interview-session",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!sessionRes.ok) {
        throw new Error(`Failed to create session: ${sessionRes.status}`);
      }

      const sessionData = await sessionRes.json();
      const newSessionId = sessionData.session_id;

      // Then, fetch questions
      console.log("Fetching questions from API...");
      const questionsRes = await fetch(
        "https://www.jobraze.in/api/ai-interview/generate-interview-questions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!questionsRes.ok) {
        throw new Error(`Failed to fetch questions: ${questionsRes.status}`);
      }

      const questionsData = await questionsRes.json();
      console.log("API Response:", questionsData);

      // Transform questions
      const transformedQuestions = questionsData.questions.map((q, index) => ({
        id: q.id || index + 1,
        text: q.question || q.text,
        hint: q.hint || "Take your time to provide a thoughtful response.",
        category: q.category || "general",
        type: q.type,
        difficulty: q.difficulty,
      }));

      console.log("Transformed questions:", transformedQuestions);

      if (onSessionCreated) {
        onSessionCreated({
          sessionId: newSessionId, // Now properly set
          questions: transformedQuestions,
        });
      }

      setIsCountingDown(true);
    } catch (err) {
      console.error("Error starting interview:", err);
      alert("Could not start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const interviewDurationInMinutes = Math.ceil(interviewDuration / 60);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Get Ready for Your Interview</h2>
        <p className="text-gray-600">
          Take a deep breath and get comfortable. The interview will start soon.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Interview Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {minutes > 0
                ? `${minutes} min${seconds > 0 ? ` ${seconds} sec` : ""}`
                : `${seconds} sec`}
            </p>
            {/* <p className="text-3xl font-bold">
              {interviewDurationInMinutes} min
            </p> */}
            <p className="text-sm text-gray-500 mt-1">
              Estimated time to complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              What to Expect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Answer questions clearly and concisely</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Find a quiet, well-lit environment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ensure your face is clearly visible</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <p className="font-medium">Important:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Do not refresh or close this window during the interview</li>
            <li>Ensure your device is plugged in or has sufficient battery</li>
            <li>Use Chrome or Firefox for best performance</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="pt-6 text-center">
        {!isCountingDown ? (
          <Button
            size="lg"
            className="px-8 text-lg h-14"
            onClick={startCountdown}
            disabled={loading}
          >
            {loading ? "Creating Session..." : "Start Interview"}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">
              {timeRemaining}
            </div>
            <p className="text-gray-500">Starting interview in...</p>
            <Button
              variant="outline"
              onClick={() => {
                setIsCountingDown(false);
                setTimeRemaining(5);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
