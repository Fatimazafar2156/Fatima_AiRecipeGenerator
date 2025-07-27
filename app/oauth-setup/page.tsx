import OAuthSetupGuide from "@/components/setup/oauth-setup-guide"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OAuthSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Google OAuth Setup</h1>
          <p className="text-muted-foreground">Enable Google authentication for your AI Recipe Generator</p>
        </div>

        <OAuthSetupGuide />
      </main>
    </div>
  )
}
