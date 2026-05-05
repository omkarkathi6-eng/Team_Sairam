"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Check, Clock, Code, Terminal, Eye, Camera, Mic } from "lucide-react"

const codingProblem = {
  title: "Two Sum Problem",
  difficulty: "Medium",
  timeLimit: 45,
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
}

export default function CodingAssessment() {
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState(`def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your solution here
    pass`)

  const [testResults, setTestResults] = useState([
    { id: 1, input: "[2,7,11,15], 9", expected: "[0,1]", actual: "", status: "pending" },
    { id: 2, input: "[3,2,4], 6", expected: "[1,2]", actual: "", status: "pending" },
    { id: 3, input: "[3,3], 6", expected: "[0,1]", actual: "", status: "pending" },
  ])

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const runCode = () => {
    // Simulate running code and getting results
    setTestResults((prev) =>
      prev.map((test) => ({
        ...test,
        actual: test.expected, // Mock: assume all tests pass
        status: "passed",
      })),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-bold text-xl">Jobraze</span>
            </div>
            <Badge variant="outline">Coding Assessment</Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Proctoring Indicators */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Camera className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Camera Active</span>
              </div>
              <div className="flex items-center gap-1">
                <Mic className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Audio Active</span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="font-mono text-orange-600">{formatTime(timeRemaining)}</span>
            </div>

            <Button onClick={() => setIsRunning(!isRunning)} variant={isRunning ? "destructive" : "default"}>
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Problem Description */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {codingProblem.title}
                </CardTitle>
                <Badge
                  variant={
                    codingProblem.difficulty === "Easy"
                      ? "default"
                      : codingProblem.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {codingProblem.difficulty}
                </Badge>
              </div>
              <CardDescription>Time Limit: {codingProblem.timeLimit} minutes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Tabs defaultValue="description" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="constraints">Constraints</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line">{codingProblem.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="mt-4 space-y-4">
                  {codingProblem.examples.map((example, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Example {index + 1}:</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Input:</strong> <code className="bg-muted px-1 rounded">{example.input}</code>
                        </div>
                        <div>
                          <strong>Output:</strong> <code className="bg-muted px-1 rounded">{example.output}</code>
                        </div>
                        <div>
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="constraints" className="mt-4">
                  <ul className="space-y-2">
                    {codingProblem.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <code className="text-sm">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Code Editor and Results */}
          <div className="flex flex-col gap-4">
            {/* Code Editor */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Code Editor</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button size="sm" onClick={runCode}>
                      <Play className="h-4 w-4 mr-1" />
                      Run Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-full border rounded-lg">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0"
                    placeholder="Write your solution here..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">Test Case {test.id}</div>
                        <div className="text-xs text-muted-foreground">Input: {test.input}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.status === "passed" && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Passed
                          </Badge>
                        )}
                        {test.status === "failed" && <Badge variant="destructive">Failed</Badge>}
                        {test.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tests Passed: {testResults.filter((t) => t.status === "passed").length}/{testResults.length}
                    </span>
                    <Button>Submit Solution</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
