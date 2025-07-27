import ConfigChecker from "@/components/setup/config-checker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <ChefHat className="h-10 w-10 text-orange-500" />
            Setup & Configuration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's make sure everything is configured correctly for your AI Recipe Generator
          </p>
        </div>

        <div className="space-y-6">
          <ConfigChecker />

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Setup Steps</CardTitle>
              <CardDescription>Follow these steps to complete your setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🔐 Google OAuth Setup</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure Google authentication with the correct callback URL.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/oauth-setup">OAuth Setup Guide</Link>
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🗄️ Database Setup</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Run the SQL script to create the recipes table in your Supabase project.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/setup/database">Setup Database</Link>
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Quick Links</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Google Cloud Console
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <a
                      href="https://supabase.com/dashboard/project/ejlobjpiqohbaczxfwbn/auth/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Your Supabase Auth Settings
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button asChild size="lg">
                  <Link href="/" className="flex items-center gap-2">
                    Start Generating Recipes
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
