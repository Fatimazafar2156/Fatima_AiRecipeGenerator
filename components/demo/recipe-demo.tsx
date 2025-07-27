"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat, Sparkles } from "lucide-react"

interface Recipe {
  title: string
  description: string
  cookingTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  tips?: string[]
}

const sampleRecipes: Record<string, Recipe> = {
  "tomato-garlic-chicken": {
    title: "Mediterranean Garlic Tomato Chicken",
    description: "A flavorful one-pan dish with tender chicken, fresh tomatoes, and aromatic garlic",
    cookingTime: "35 minutes",
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "4 chicken breasts, boneless and skinless",
      "4 large tomatoes, diced",
      "6 cloves garlic, minced",
      "2 tbsp olive oil",
      "1 tsp dried oregano",
      "1/2 tsp dried basil",
      "Salt and pepper to taste",
      "1/4 cup fresh parsley, chopped",
      "1/2 cup chicken broth",
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, oregano, and basil on both sides",
      "Heat olive oil in a large skillet over medium-high heat",
      "Add chicken breasts and cook for 6-7 minutes per side until golden brown",
      "Remove chicken and set aside on a plate",
      "In the same skillet, add minced garlic and sauté for 1 minute until fragrant",
      "Add diced tomatoes and chicken broth, scraping up any browned bits",
      "Return chicken to the skillet and simmer for 10-12 minutes",
      "Check that chicken reaches internal temperature of 165°F (74°C)",
      "Garnish with fresh parsley and serve immediately",
    ],
    tips: [
      "Pound chicken to even thickness for uniform cooking",
      "Use cherry tomatoes for a sweeter flavor",
      "Serve over rice, pasta, or with crusty bread",
    ],
  },
  "butter-chicken": {
    title: "Authentic Butter Chicken (Murgh Makhani)",
    description: "Rich and creamy Indian curry with tender chicken in a tomato-based sauce",
    cookingTime: "45 minutes",
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      "2 lbs chicken thighs, cut into chunks",
      "1 cup plain yogurt",
      "2 tsp garam masala",
      "1 tsp cumin powder",
      "1 tsp coriander powder",
      "1/2 tsp turmeric",
      "1 tsp paprika",
      "4 cloves garlic, minced",
      "1 inch ginger, grated",
      "1 can (14oz) crushed tomatoes",
      "1/2 cup heavy cream",
      "3 tbsp butter",
      "1 medium onion, finely chopped",
      "Salt to taste",
      "Fresh cilantro for garnish",
    ],
    instructions: [
      "Marinate chicken with yogurt, half the garam masala, cumin, coriander, turmeric, and salt for 30 minutes",
      "Heat 1 tbsp butter in a large pan over medium-high heat",
      "Cook marinated chicken until browned and cooked through, about 8-10 minutes",
      "Remove chicken and set aside",
      "In the same pan, add remaining butter and sauté onions until golden",
      "Add garlic and ginger, cook for 1 minute until fragrant",
      "Add crushed tomatoes, remaining garam masala, and paprika",
      "Simmer for 10 minutes until sauce thickens",
      "Stir in heavy cream and return chicken to the pan",
      "Simmer for 5 more minutes to combine flavors",
      "Taste and adjust seasoning with salt",
      "Garnish with fresh cilantro and serve with basmati rice and naan",
    ],
    tips: [
      "Marinating longer (up to 4 hours) develops deeper flavors",
      "Use chicken thighs for more tender, juicy results",
      "Adjust cream amount based on desired richness",
    ],
  },
  "pasta-mushrooms-spinach": {
    title: "Creamy Mushroom Spinach Pasta",
    description: "A comforting vegetarian pasta with earthy mushrooms and fresh spinach in a creamy sauce",
    cookingTime: "25 minutes",
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "12 oz penne or fettuccine pasta",
      "8 oz mixed mushrooms (cremini, shiitake), sliced",
      "4 cups fresh spinach",
      "3 cloves garlic, minced",
      "1/2 cup white wine (optional)",
      "1 cup heavy cream",
      "1/2 cup grated Parmesan cheese",
      "2 tbsp olive oil",
      "2 tbsp butter",
      "Salt and black pepper to taste",
      "1/4 tsp red pepper flakes",
      "Fresh basil for garnish",
    ],
    instructions: [
      "Cook pasta according to package directions until al dente, reserve 1 cup pasta water",
      "Heat olive oil and butter in a large skillet over medium-high heat",
      "Add sliced mushrooms and cook until golden brown, about 5-6 minutes",
      "Add garlic and red pepper flakes, sauté for 1 minute",
      "Pour in white wine (if using) and let it reduce by half",
      "Add heavy cream and bring to a gentle simmer",
      "Add fresh spinach and cook until wilted, about 2 minutes",
      "Add cooked pasta to the skillet with a splash of pasta water",
      "Toss everything together, adding more pasta water if needed for consistency",
      "Remove from heat and stir in Parmesan cheese",
      "Season with salt and pepper to taste",
      "Serve immediately garnished with fresh basil and extra Parmesan",
    ],
    tips: [
      "Don't overcook mushrooms - they should be golden, not soggy",
      "Save some pasta water - it helps bind the sauce",
      "Add spinach at the end to maintain its bright color",
    ],
  },
}

export default function RecipeDemo() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecipe = async (type: "ingredients" | "dish", input: string) => {
    setIsGenerating(true)
    setCompletedSteps([])

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let recipe: Recipe

    if (input.toLowerCase().includes("tomato") && input.toLowerCase().includes("chicken")) {
      recipe = sampleRecipes["tomato-garlic-chicken"]
    } else if (input.toLowerCase().includes("butter chicken")) {
      recipe = sampleRecipes["butter-chicken"]
    } else if (input.toLowerCase().includes("pasta") || input.toLowerCase().includes("mushroom")) {
      recipe = sampleRecipes["pasta-mushrooms-spinach"]
    } else {
      // Default recipe for demo
      recipe = sampleRecipes["tomato-garlic-chicken"]
    }

    setSelectedRecipe(recipe)
    setIsGenerating(false)
  }

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) => (prev.includes(stepIndex) ? prev.filter((i) => i !== stepIndex) : [...prev, stepIndex]))
  }

  const progress = selectedRecipe ? (completedSteps.length / selectedRecipe.instructions.length) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-500" />
          Recipe Generator Demo
        </h1>
        <p className="text-muted-foreground">Try generating recipes with different ingredients and dish names</p>
      </div>

      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ingredients">By Ingredients</TabsTrigger>
          <TabsTrigger value="dish">By Dish Name</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Recipe from Ingredients</CardTitle>
              <CardDescription>Enter ingredients you have available and get a creative recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => generateRecipe("ingredients", "tomato, garlic, chicken")}
                  disabled={isGenerating}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="font-semibold">Tomato, Garlic, Chicken</span>
                  <span className="text-sm opacity-75">Mediterranean style</span>
                </Button>
                <Button
                  onClick={() => generateRecipe("ingredients", "pasta, mushrooms, spinach")}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="font-semibold">Pasta, Mushrooms, Spinach</span>
                  <span className="text-sm opacity-75">Creamy vegetarian</span>
                </Button>
                <Button
                  onClick={() => generateRecipe("ingredients", "rice, vegetables, soy sauce")}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="font-semibold">Rice, Vegetables, Soy Sauce</span>
                  <span className="text-sm opacity-75">Asian stir-fry</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dish" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Recipe by Dish Name</CardTitle>
              <CardDescription>Search for specific dishes to get detailed recipes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => generateRecipe("dish", "butter chicken")}
                  disabled={isGenerating}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="font-semibold">Butter Chicken</span>
                  <span className="text-sm opacity-75">Indian curry</span>
                </Button>
                <Button
                  onClick={() => generateRecipe("dish", "carbonara")}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="font-semibold">Carbonara</span>
                  <span className="text-sm opacity-75">Italian pasta</span>
                </Button>
                <Button
                  onClick={() => generateRecipe("dish", "pad thai")}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <span className="font-semibold">Pad Thai</span>
                  <span className="text-sm opacity-75">Thai noodles</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isGenerating && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 animate-spin text-orange-500" />
              <span className="text-lg">Generating your recipe...</span>
            </div>
            <p className="text-muted-foreground mt-2">Our AI chef is crafting the perfect recipe for you</p>
          </CardContent>
        </Card>
      )}

      {selectedRecipe && !isGenerating && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{selectedRecipe.title}</CardTitle>
                  <CardDescription className="text-base">{selectedRecipe.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-4">
                  {selectedRecipe.difficulty}
                </Badge>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedRecipe.cookingTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{selectedRecipe.servings} servings</span>
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
                  {selectedRecipe.ingredients.map((ingredient, index) => (
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
                    {completedSteps.length} of {selectedRecipe.instructions.length} steps completed
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
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleStep(index)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedSteps.includes(index)
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-gray-300 hover:border-orange-500"
                        }`}
                      >
                        {completedSteps.includes(index) && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
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

          {selectedRecipe.tips && (
            <Card>
              <CardHeader>
                <CardTitle>Chef's Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedRecipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <Button size="lg" className="px-8">
              Save Recipe to Collection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
