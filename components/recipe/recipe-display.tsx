"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Clock, Users, Save, Check, Info } from "lucide-react"

interface Recipe {
  title: string
  description: string
  cookingTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  _note?: string
  _reason?: string
}

interface RecipeDisplayProps {
  recipe: Recipe
  onSave?: (recipe: Recipe) => Promise<void> 
}

export default function RecipeDisplay({ recipe, onSave }: RecipeDisplayProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepIndex) ? prev.filter((i) => i !== stepIndex) : [...prev, stepIndex]
    )
  }

     // ...existing code...
    const handleSaveClick = async () => {
      if (!onSave) return
  
      setIsSaving(true)
      try {
        await onSave(recipe)
        setIsSaved(true)
        // Success toast only if no error thrown
        toast({
          title: "Recipe saved!",
          description: "Recipe has been added to your collection.",
        })
      } catch (error: any) {
        setIsSaved(false)
        const authErrors = ["Sign in first", "Authentication required"]
        const errorMsg = error?.message || error?.toString() || ""
        toast({
          title: "Save Failed",
          description: errorMsg,
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  // ...existing code....

  const progress = (completedSteps.length / recipe.instructions.length) * 100

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {recipe._note && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> {recipe._note}
            {recipe._reason && (
              <div className="mt-2 text-sm text-muted-foreground">Reason: {recipe._reason}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{recipe.title}</CardTitle>
              <CardDescription className="text-base">{recipe.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="ml-4">
              {recipe.difficulty}
            </Badge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-sm">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Instructions</CardTitle>
              <div className="text-sm text-muted-foreground">
                {completedSteps.length} of {recipe.instructions.length} steps completed
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStep(index)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      completedSteps.includes(index)
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-300 hover:border-orange-500"
                    }`}
                  >
                    {completedSteps.includes(index) && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <span className="font-medium text-orange-600 text-sm">Step {index + 1}</span>
                    <p
                      className={`text-sm mt-1 ${
                        completedSteps.includes(index) ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {instruction}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {progress === 100 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-green-600 font-semibold">🎉 Congratulations!</div>
                <div className="text-green-700 text-sm mt-1">
                  You've completed the recipe! Enjoy your delicious meal.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSaveClick}
          disabled={isSaving || isSaved}
          size="lg"
          className="px-8"
          variant={isSaved ? "outline" : "default"}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : isSaved ? "Recipe Saved!" : "Save Recipe"}
        </Button>
      </div>
    </div>
  )
}
