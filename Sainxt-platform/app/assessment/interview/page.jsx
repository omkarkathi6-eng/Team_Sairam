"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Pause,
  SkipForward,
  Clock,
  Brain,
  MessageSquare,
  Eye,
  AlertCircle,
} from "lucide-react"

const interviewQuestions = [
  {
    id: 1,
    question: "Tell me about yourself and your background in AI/ML.",
    type: "behavioral",
    timeLimit: 120,
    tips: "Focus on relevant experience and passion for AI",
  },
  // ... rest of questions
]

export default function AIInterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(interviewQuestions[0].timeLimit)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [transcript, setTranscript] = useState("")
  const [interviewStarted, setInterviewStarted] = useState(false)
  const videoRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted flag so browser-only code runs only on client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Initialize camera only on client and when video is enabled
    if (videoRef.current && videoEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.error("Error accessing camera:", err))
    }
  }, [videoEnabled, mounted])

  useEffect(() => {
    let interval
    if (isRecording && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, timeRemaining])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = () => {
    setIsRecording(true)
    setInterviewStarted(true)
  }

  const pauseRecording = () => {
    setIsRecording(false)
  }

  const nextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeRemaining(interviewQuestions[currentQuestion + 1].timeLimit)
      setIsRecording(false)
      setTranscript("")
    }
  }

  const currentQ = interviewQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / interviewQuestions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* ... your other JSX ... */}

      {/* Video Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {/* Only render video element if mounted on client */}
            {mounted ? (
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-900" />
            )}

            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">REC</span>
              </div>
            )}

            {/* Timer */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant={videoEnabled ? "default" : "outline"}
              onClick={() => setVideoEnabled(!videoEnabled)}
            >
              {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant={audioEnabled ? "default" : "outline"}
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ... rest of your JSX */}
    </div>
  )
}
