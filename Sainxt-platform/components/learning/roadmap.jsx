"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Lock, Play, ArrowRight } from "lucide-react"

export function LearningRoadmap({ phases, skillLevel, onStartPhase, onContinuePhase }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "current":
        return <Play className="h-6 w-6 text-blue-600" />
      case "locked":
        return <Lock className="h-6 w-6 text-gray-400" />
      default:
        return <Clock className="h-6 w-6 text-orange-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "current":
        return "bg-blue-500"
      case "locked":
        return "bg-gray-300"
      default:
        return "bg-orange-500"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "current":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "locked":
        return <Badge variant="secondary">Locked</Badge>
      default:
        return <Badge className="bg-orange-100 text-orange-800">Available</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Learning Roadmap</h2>
        <p className="text-muted-foreground">
          Personalized learning path for {skillLevel} level AI/ML practitioners
        </p>
      </div>

      <div className="relative">
        {phases.map((phase, index) => (
          <div key={phase.id} className="relative">
            {/* Connection Line */}
            {index < phases.length - 1 && (
              <div className="absolute left-6 top-20 w-0.5 h-24 bg-gray-200 z-0" />
            )}

            <Card className={`relative z-10 ${phase.status === "current" ? "border-blue-500 shadow-md" : ""}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(phase.status)}`}>
                    {getStatusIcon(phase.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{phase.title}</CardTitle>
                      {getStatusBadge(phase.status)}
                    </div>
                    <CardDescription className="text-base">{phase.description}</CardDescription>

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{phase.duration}</span>
                      </div>
                      <span>•</span>
                      <span>{phase.estimatedHours} hours</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {phase.status === "current" && phase.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.topics.map((topic, i) => (
                      <Badge key={i} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {phase.prerequisites && phase.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.prerequisites.map((prereq, i) => (
                        <Badge key={i} variant="secondary">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {phase.status === "current" && (
                    <Button onClick={() => onContinuePhase?.(phase.id)} className="flex-1">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {phase.status === "available" && (
                    <Button onClick={() => onStartPhase?.(phase.id)} className="flex-1">
                      Start Phase
                      <Play className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {phase.status === "completed" && (
                    <Button variant="outline" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Review Content
                    </Button>
                  )}
                  {phase.status === "locked" && (
                    <Button variant="outline" disabled className="flex-1">
                      <Lock className="mr-2 h-4 w-4" />
                      Complete Prerequisites
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
