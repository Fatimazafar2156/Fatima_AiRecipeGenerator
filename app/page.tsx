"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import RecipeGenerator from "@/components/recipe/recipe-generator"
import RecipeDisplay from "@/components/recipe/recipe-display"
import RecipeHistory from "@/components/recipe/recipe-history"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChefHat, Sparkles, BookOpen, AlertTriangle } from "lucide-react"
import Link from "next/link"
interface Recipe {
  title: string
  description: string
  cookingTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
}

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [activeTab, setActiveTab] = useState("generate")
  const [configError, setConfigError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)


  useEffect(() => {
    // Check if required environment variables are present
    const checkConfig = () => {
      // Check if we're in the browser and have access to the environment variables
      if (typeof window !== "undefined") {
        // We can't access process.env directly in the browser, so we'll check via API
        fetch("/api/test-supabase")
          .then((response) => response.json())
          .then((data) => {
            if (!data.connected && data.error?.includes("Missing Supabase environment variables")) {
              setConfigError("Missing Supabase environment variables. Please check your .env.local file.")
            }
          })
          .catch((error) => {
            console.error("Config check failed:", error)
          })
      }
    }

    checkConfig()
  }, [])

  const handleRecipeGenerated = (recipe: Recipe) => {
    setCurrentRecipe(recipe)
    setActiveTab("recipe")
  }

  const handleRecipeSelected = (recipe: Recipe) => {
    setCurrentRecipe(recipe)
    setActiveTab("recipe")
  }

  // ...existing code...

const handleSaveRecipe = async (recipe: Recipe) => {
  setSaveError(null)
  const response = await fetch("/api/save-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  })

  if (!response.ok) {
    const errorData = await response.json()
    if (
      response.status === 401 &&
      (errorData.details === "Sign in first" || errorData.error === "Authentication required")
    ) {
      setSaveError("Sign in first")
    } else {
      setSaveError(errorData.error || "Failed to save recipe")
    }
    return // Do not show recipe saved prompt
  }
  // ...handle success...
}

// ...existing code...


  if (configError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription className="mt-2">
              {configError}
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium mb-2">To fix this issue:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>
                    Create a <code>.env.local</code> file in your project root
                  </li>
                  <li>Add your Supabase credentials:</li>
                </ol>
                <pre className="text-xs mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded overflow-x-auto">
                  {`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                </pre>
                <p className="text-sm mt-2">
                  Get these values from your{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Supabase Dashboard
                  </a>{" "}
                  → Settings → API
                </p>
              </div>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/setup">Go to Setup Page</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <ChefHat className="h-10 w-10 text-orange-500" />
            AI Recipe Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ingredients into delicious recipes with the power of AI. Get personalized cooking
            instructions tailored to what you have at home.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="recipe" disabled={!currentRecipe}>
              <ChefHat className="h-4 w-4" />
              Recipe
            </TabsTrigger>
            <TabsTrigger value="history">
              <BookOpen className="h-4 w-4" />
              My Recipes
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="generate" className="space-y-6">
              <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">How it works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-orange-600 font-bold">1</span>
                      </div>
                      <h3 className="font-semibold">Input Ingredients</h3>
                      <p className="text-sm text-muted-foreground">
                        Tell us what ingredients you have or what dish you want to make
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-orange-600 font-bold">2</span>
                      </div>
                      <h3 className="font-semibold">AI Magic</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI creates a personalized recipe with detailed instructions
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-orange-600 font-bold">3</span>
                      </div>
                      <h3 className="font-semibold">Start Cooking</h3>
                      <p className="text-sm text-muted-foreground">
                        Follow step-by-step instructions and track your progress
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipe" className="space-y-6">
  {saveError && (
    <Alert className="max-w-2xl mx-auto mb-4" variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{saveError}</AlertDescription>
    </Alert>
  )}
  {currentRecipe ? (
    <RecipeDisplay recipe={currentRecipe} onSave={handleSaveRecipe} />
  ) : (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">No Recipe Selected</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Generate a recipe or select one from your history to view it here.
        </p>
      </CardContent>
    </Card>
  )}
</TabsContent>

            <TabsContent value="history" className="space-y-6">
              <RecipeHistory onSelectRecipe={handleRecipeSelected} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
