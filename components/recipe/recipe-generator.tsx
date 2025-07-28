"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ChefHat, Sparkles, Info, Plus, Minus, X } from "lucide-react"
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

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: Recipe) => void
}

export default function RecipeGenerator({ onRecipeGenerated }: RecipeGeneratorProps) {
  const [ingredients, setIngredients] = useState<string[]>([""])
  const [dishName, setDishName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSampleNote, setShowSampleNote] = useState(false)
  const { toast } = useToast()

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const clearAllIngredients = () => {
    setIngredients([""])
  }

  const generateRecipe = async (type: "ingredients" | "dish") => {
    let input: string

    if (type === "ingredients") {
      const validIngredients = ingredients.filter((ing) => ing.trim() !== "")
      if (validIngredients.length === 0) {
        toast({
          title: "Ingredients required",
          description: "Please add at least one ingredient.",
          variant: "destructive",
        })
        return
      }
      input = validIngredients.join(", ")
    } else {
      input = dishName.trim()
      if (!input) {
        toast({
          title: "Dish name required",
          description: "Please enter a dish name.",
          variant: "destructive",
        })
        return
      }
    }

    setIsGenerating(true)
    setShowSampleNote(false)

    try {
      console.log("Sending request:", { type, input })

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, input }),
      })

      console.log("Response status:", response.status)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      // Validate the recipe data
      if (!data.title || !data.ingredients || !data.instructions) {
        throw new Error("Invalid recipe data received")
      }

      // Check if this is a sample recipe
      if (data._note) {
        setShowSampleNote(true)
        toast({
          title: "Sample Recipe Generated",
          description: data._reason || "Using sample recipe due to API limitations.",
          variant: "default",
        })
      } else {
        toast({
          title: "Recipe generated!",
          description: "Your personalized AI recipe is ready.",
        })
      }

      onRecipeGenerated(data)

      // Clear inputs
      setIngredients([""])
      setDishName("")
    } catch (error) {
      console.error("Recipe generation error:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const quickIngredientSets = [
    ["chicken", "tomatoes", "garlic", "onion"],
    ["pasta", "mushrooms", "spinach", "cream"],
    ["rice", "vegetables", "soy sauce", "ginger"],
    ["salmon", "lemon", "asparagus", "herbs"],
  ]

  const quickDishes = ["Butter Chicken", "Carbonara", "Pad Thai", "Beef Stir Fry"]

  const loadQuickIngredients = (ingredientSet: string[]) => {
    setIngredients([...ingredientSet, ""])
  }

  return (
    <div className="space-y-4">
      {showSampleNote && (
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This is a sample recipe. The OpenAI API is currently unavailable due to quota limits.
            You can still explore the app features with these curated recipes!
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <ChefHat className="h-6 w-6 text-orange-500" />
            AI Recipe Generator
          </CardTitle>
          <CardDescription>
            Generate personalized recipes using AI with your ingredients or dish preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">By Ingredients</TabsTrigger>
              <TabsTrigger value="dish">By Dish Name</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Your Ingredients</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllIngredients}
                      className="text-xs bg-transparent"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addIngredient}
                      className="text-xs bg-transparent"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add More
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder={`Ingredient ${index + 1} (e.g., chicken breast, tomatoes)`}
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                        className="flex-shrink-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Quick ingredient sets */}
                <div className="pt-3 border-t">
                  <Label className="text-sm font-medium mb-2 block">Quick Start - Popular Combinations:</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickIngredientSets.map((ingredientSet, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => loadQuickIngredients(ingredientSet)}
                        disabled={isGenerating}
                        className="h-auto p-3 flex flex-col items-start text-left"
                      >
                        <span className="font-medium text-xs">{ingredientSet.slice(0, 2).join(" + ")}</span>
                        <span className="text-xs text-muted-foreground">{ingredientSet.slice(2).join(", ")}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => generateRecipe("ingredients")}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-4 w-4" />
                    Generate Recipe from Ingredients
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="dish" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dish" className="text-base font-semibold">
                  Dish Name
                </Label>
                <Input
                  id="dish"
                  placeholder="Enter a dish name (e.g., Butter Chicken, Carbonara, Pad Thai)"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="text-base"
                />

                {/* Quick dish suggestions */}
                <div className="pt-3 border-t">
                  <Label className="text-sm font-medium mb-2 block">Popular Dishes:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {quickDishes.map((dish, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setDishName(dish)}
                        disabled={isGenerating}
                        className="text-sm"
                      >
                        {dish}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={() => generateRecipe("dish")} disabled={isGenerating} className="w-full" size="lg">
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-4 w-4" />
                    Generate Recipe for Dish
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
