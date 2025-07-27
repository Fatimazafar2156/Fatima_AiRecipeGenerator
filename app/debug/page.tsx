import N8nDebug from "@/components/debug/n8n-debug"
import Header from "@/components/layout/header"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">n8n Connection Debug</h1>
          <p className="text-muted-foreground">Diagnose and fix n8n webhook connection issues</p>
        </div>
        <N8nDebug />
      </main>
    </div>
  )
}
