"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Key, CheckCircle, Copy, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function OAuthSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const { toast } = useToast()

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
    setTimeout(() => setCopiedStep(null), 2000)
  }

  // Your actual Supabase callback URL
  const supabaseCallbackUrl = "https://ejlobjpiqohbaczxfwbn.supabase.co/auth/v1/callback"
  const appCallbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback`
      : "http://localhost:3000/api/auth/callback"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-6 w-6 text-blue-500" />
            Google OAuth Setup Guide
          </CardTitle>
          <CardDescription>Complete setup for Google authentication with your Supabase project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">Important: Callback URL Required</AlertTitle>
            <AlertDescription className="text-orange-700">
              You need to register the Supabase callback URL in your Google OAuth configuration. This is the URL that
              Google will redirect to after authentication.
            </AlertDescription>
          </Alert>

          {/* Step 1: Google Cloud Console */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 1</Badge>
              <h3 className="text-lg font-semibold">Create Google OAuth App</h3>
            </div>
            <div className="pl-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                First, create a Google OAuth application in Google Cloud Console:
              </p>
              <ol className="text-sm space-y-2 list-decimal list-inside ml-4">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>Create a new project or select an existing one</li>
                <li>
                  Go to <strong>"APIs & Services"</strong> → <strong>"Credentials"</strong>
                </li>
                <li>
                  Click <strong>"Create Credentials"</strong> → <strong>"OAuth 2.0 Client IDs"</strong>
                </li>
                <li>
                  Set application type to <strong>"Web application"</strong>
                </li>
                <li>Give it a name (e.g., "AI Recipe Generator")</li>
              </ol>
              <Button asChild variant="outline">
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Google Cloud Console
                </a>
              </Button>
            </div>
          </div>

          {/* Step 2: Add Authorized Redirect URIs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Step 2 - CRITICAL</Badge>
              <h3 className="text-lg font-semibold">Add Authorized Redirect URIs</h3>
            </div>
            <div className="pl-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                In the OAuth client configuration, add these <strong>exact</strong> redirect URIs:
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">1. Supabase Callback URL (Required):</p>
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-center justify-between">
                    <code className="text-sm font-mono text-red-800">{supabaseCallbackUrl}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(supabaseCallbackUrl, 1)}>
                      {copiedStep === 1 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">2. Local Development URL (Optional):</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md flex items-center justify-between">
                    <code className="text-sm font-mono">{appCallbackUrl}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(appCallbackUrl, 2)}>
                      {copiedStep === 2 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Important:</strong> The Supabase callback URL{" "}
                  <code className="bg-red-100 px-1 rounded">{supabaseCallbackUrl}</code> must be added exactly as shown.
                  This is where Google will redirect after authentication.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Step 3: Get Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 3</Badge>
              <h3 className="text-lg font-semibold">Copy OAuth Credentials</h3>
            </div>
            <div className="pl-4 space-y-3">
              <p className="text-sm text-muted-foreground">After creating the OAuth client, copy:</p>
              <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                <li>
                  <strong>Client ID</strong> (looks like: 123456789-abc123.apps.googleusercontent.com)
                </li>
                <li>
                  <strong>Client Secret</strong> (looks like: GOCSPX-abc123...)
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4: Configure Supabase */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Step 4</Badge>
              <h3 className="text-lg font-semibold">Configure Supabase</h3>
            </div>
            <div className="pl-4 space-y-3">
              <p className="text-sm text-muted-foreground">Now configure Google OAuth in your Supabase project:</p>
              <ol className="text-sm space-y-2 list-decimal list-inside ml-4">
                <li>
                  Go to your{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>
                  Navigate to <strong>Authentication</strong> → <strong>Providers</strong>
                </li>
                <li>
                  Find <strong>Google</strong> and toggle it <strong>ON</strong>
                </li>
                <li>
                  Paste your <strong>Client ID</strong> and <strong>Client Secret</strong>
                </li>
                <li>
                  Click <strong>Save</strong>
                </li>
              </ol>
              <Button asChild variant="outline">
                <a
                  href="https://supabase.com/dashboard/project/ejlobjpiqohbaczxfwbn/auth/providers"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Your Supabase Auth Settings
                </a>
              </Button>
            </div>
          </div>

          {/* Step 5: Test */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Step 5</Badge>
              <h3 className="text-lg font-semibold">Test Authentication</h3>
            </div>
            <div className="pl-4 space-y-3">
              <p className="text-sm text-muted-foreground">After completing the setup:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                <li>Return to your app</li>
                <li>Click "Continue with Google"</li>
                <li>You should be redirected to Google's sign-in page</li>
                <li>After signing in, you'll be redirected back to your app</li>
              </ol>
            </div>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Quick Summary</AlertTitle>
            <AlertDescription className="text-green-700">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Create Google OAuth app in Google Cloud Console</li>
                <li>
                  Add <code className="bg-green-100 px-1 rounded">{supabaseCallbackUrl}</code> as redirect URI
                </li>
                <li>Copy Client ID and Client Secret</li>
                <li>Enable Google provider in Supabase with your credentials</li>
                <li>Test the authentication flow</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
