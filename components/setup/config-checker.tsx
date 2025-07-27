"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Key, Globe, Zap } from "lucide-react"

interface ConfigStatus {
  name: string
  status: "success" | "error" | "warning"
  message: string
  icon: React.ReactNode
}

export default function ConfigChecker() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"success" | "error" | "warning">("warning")

  const checkConfiguration = async () => {
    setIsChecking(true)
    const checks: ConfigStatus[] = []

    // Check Supabase configuration
    try {
      const response = await fetch("/api/test-supabase")
      const result = await response.json()

      if (result.connected) {
        checks.push({
          name: "Supabase Connection",
          status: "success",
          message: "Successfully connected to Supabase",
          icon: <Database className="h-4 w-4" />,
        })
      } else {
        checks.push({
          name: "Supabase Connection",
          status: "error",
          message: result.error || "Failed to connect to Supabase",
          icon: <Database className="h-4 w-4" />,
        })
      }
    } catch (error) {
      checks.push({
        name: "Supabase Connection",
        status: "error",
        message: "Failed to test Supabase connection",
        icon: <Database className="h-4 w-4" />,
      })
    }

    // Check Database Table
    try {
      const response = await fetch("/api/test-database")
      const result = await response.json()

      if (result.connected && result.tableExists) {
        checks.push({
          name: "Database Table",
          status: "success",
          message: `Recipes table exists (${result.recipeCount} recipes)`,
          icon: <Database className="h-4 w-4" />,
        })
      } else if (result.connected && !result.tableExists) {
        checks.push({
          name: "Database Table",
          status: "error",
          message: "Recipes table does not exist. Run the setup script.",
          icon: <Database className="h-4 w-4" />,
        })
      } else {
        checks.push({
          name: "Database Table",
          status: "error",
          message: result.error || "Failed to check database table",
          icon: <Database className="h-4 w-4" />,
        })
      }
    } catch (error) {
      checks.push({
        name: "Database Table",
        status: "error",
        message: "Failed to test database table",
        icon: <Database className="h-4 w-4" />,
      })
    }

    // Check Gemini API configuration
    try {
      const response = await fetch("/api/test-gemini")
      const result = await response.json()

      if (result.connected) {
        checks.push({
          name: "Gemini AI API",
          status: "success",
          message: "Gemini API key is valid",
          icon: <Zap className="h-4 w-4" />,
        })
      } else {
        checks.push({
          name: "Gemini AI API",
          status: "error",
          message: result.error || "Invalid Gemini API key",
          icon: <Zap className="h-4 w-4" />,
        })
      }
    } catch (error) {
      checks.push({
        name: "Gemini AI API",
        status: "error",
        message: "Failed to test Gemini connection",
        icon: <Zap className="h-4 w-4" />,
      })
    }

    // Check Google OAuth configuration via API
    try {
      const response = await fetch("/api/test-oauth")
      const result = await response.json()

      if (result.configured) {
        checks.push({
          name: "Google OAuth",
          status: "success",
          message: "Google OAuth is configured in Supabase",
          icon: <Key className="h-4 w-4" />,
        })
      } else {
        checks.push({
          name: "Google OAuth",
          status: "warning",
          message: result.message || "Google OAuth configuration needs verification",
          icon: <Key className="h-4 w-4" />,
        })
      }
    } catch (error) {
      checks.push({
        name: "Google OAuth",
        status: "warning",
        message: "Could not verify Google OAuth configuration",
        icon: <Key className="h-4 w-4" />,
      })
    }

    // Check Site URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    checks.push({
      name: "Site URL",
      status: "success",
      message: `Site URL: ${siteUrl}`,
      icon: <Globe className="h-4 w-4" />,
    })

    setConfigStatus(checks)

    // Determine overall status
    const hasErrors = checks.some((check) => check.status === "error")
    const hasWarnings = checks.some((check) => check.status === "warning")

    if (hasErrors) {
      setOverallStatus("error")
    } else if (hasWarnings) {
      setOverallStatus("warning")
    } else {
      setOverallStatus("success")
    }

    setIsChecking(false)
  }

  useEffect(() => {
    checkConfiguration()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Configuration Status
              {getStatusIcon(overallStatus)}
            </CardTitle>
            <CardDescription>Checking your environment configuration and API connections</CardDescription>
          </div>
          <Button onClick={checkConfiguration} disabled={isChecking} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overallStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 All systems are ready! You can now start generating recipes.
            </AlertDescription>
          </Alert>
        )}

        {overallStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              ❌ Some critical services are not configured properly. Please fix the errors below.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {configStatus.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {check.icon}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-muted-foreground">{check.message}</div>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>

        {overallStatus !== "success" && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">Setup Instructions:</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>
                • <strong>Supabase:</strong> Make sure your .env.local has NEXT_PUBLIC_SUPABASE_URL and
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </li>
              <li>
                • <strong>Database:</strong> Run the SQL setup script in your Supabase SQL editor
              </li>
              <li>
                • <strong>Gemini API:</strong> Add GOOGLE_GENAI_API_KEY to your .env.local file
              </li>
              <li>
                • <strong>Google OAuth:</strong> Configure Google OAuth in your Supabase dashboard under Authentication
                → Providers
              </li>
              <li>• Restart your development server after making changes</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
