"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap } from "lucide-react"
interface DebugTest {
  test: string
  status: "PASS" | "FAIL" | "ERROR"
  message: string
  response?: any
  solution?: string
  solutions?: string[]
}
interface DebugInfo {
  timestamp: string
  environment: Record<string, string>
  tests: DebugTest[]
}

export default function N8nDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDebug = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-n8n-debug")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Debug test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "FAIL":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "ERROR":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <Badge className="bg-green-100 text-green-800">PASS</Badge>
      case "FAIL":
        return <Badge variant="destructive">FAIL</Badge>
      case "ERROR":
        return <Badge className="bg-orange-100 text-orange-800">ERROR</Badge>
      default:
        return <Badge variant="secondary">UNKNOWN</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-500" />
              n8n Connection Debug
            </CardTitle>
            <CardDescription>Diagnose n8n webhook connection issues</CardDescription>
          </div>
          <Button onClick={runDebug} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Testing..." : "Run Debug"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!debugInfo && !isLoading && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Click "Run Debug" to test your n8n connection and identify issues.</AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <>
            {/* Environment Info */}
            <div>
              <h3 className="font-semibold mb-3">Environment Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(debugInfo.environment).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">{key}:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {key.includes("KEY") && value !== "NOT_SET" ? "***HIDDEN***" : value}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            <div>
              <h3 className="font-semibold mb-3">Test Results</h3>
              <div className="space-y-4">
                {debugInfo.tests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(test.status)}
                        <span className="font-medium">{test.test}</span>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{test.message}</p>

                    {test.response && (
                      <div className="mb-3">
                        <h4 className="font-medium text-sm mb-2">Response:</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(test.response, null, 2)}
                        </pre>
                      </div>
                    )}

                    {test.solution && (
                      <Alert className="mt-3">
                        <AlertDescription>
                          <strong>Solution:</strong> {test.solution}
                        </AlertDescription>
                      </Alert>
                    )}

                    {test.solutions && (
                      <Alert className="mt-3">
                        <AlertDescription>
                          <strong>Possible Solutions:</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {test.solutions.map((solution, idx) => (
                              <li key={idx} className="text-sm">
                                {solution}
                              </li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Common Issues */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Common n8n Issues:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>
                  <strong>Local n8n not running:</strong> Start with <code>npx n8n</code> or check http://localhost:5678
                </li>
                <li>
                  <strong>Workflow not active:</strong> Make sure your workflow is saved and activated in n8n
                </li>
                <li>
                  <strong>Wrong webhook URL:</strong> Copy the exact webhook URL from your n8n workflow
                </li>
                <li>
                  <strong>Credentials not linked:</strong> Make sure your Gemini API credential is linked to the HTTP
                  Request node
                </li>
                <li>
                  <strong>Firewall/Network:</strong> Check if your n8n instance is accessible from your app
                </li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
