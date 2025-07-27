"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Clock, Users, Search, Trash2, Eye } from "lucide-react"

interface SavedRecipe {
  id: string
  title: string
  description: string
  cookingTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  created_at: string
}

interface RecipeHistoryProps {
  onSelectRecipe: (recipe: SavedRecipe) => void
}

export default function RecipeHistory({ onSelectRecipe }: RecipeHistoryProps) {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<SavedRecipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRecipes()
  }, [])

  useEffect(() => {
    const filtered = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredRecipes(filtered)
  }, [recipes, searchTerm])

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes")
      if (!response.ok) throw new Error("Failed to fetch recipes")

      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recipes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete recipe")

      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
      toast({
        title: "Recipe deleted",
        description: "Recipe has been removed from your collection.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recipe.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-lg">Loading your recipes...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Recipe Collection</CardTitle>
          <CardDescription>Your saved recipes ({recipes.length} total)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-lg text-muted-foreground">
              {searchTerm ? "No recipes match your search." : "No saved recipes yet."}
            </div>
            {!searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">Generate and save your first recipe to get started!</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                  <Badge variant="outline" className="ml-2 flex-shrink-0">
                    {recipe.difficulty}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => onSelectRecipe(recipe)}>
                    <Eye className="mr-1 h-3 w-3" />
                    View Recipe
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecipe(recipe.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
