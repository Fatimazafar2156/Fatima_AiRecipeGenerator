interface N8nRecipeRequest {
  type: "ingredients" | "dish"
  input: string
  userId: string
  userEmail?: string
  preferences?: {
    dietary?: string[]
    cuisine?: string
    difficulty?: "Easy" | "Medium" | "Hard"
  }
}

interface N8nRecipeResponse {
  title: string
  description: string
  cookingTime: string
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  ingredients: string[]
  instructions: string[]
  cuisine?: string
  nutritionInfo?: {
    calories?: number
    protein?: string
    carbs?: string
    fat?: string
  }
}

export class N8nClient {
  private webhookUrl: string
  private apiKey?: string

  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL || ""
    this.apiKey = process.env.N8N_API_KEY

    if (!this.webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL environment variable is required")
    }
  }

  async generateRecipe(request: N8nRecipeRequest): Promise<N8nRecipeResponse> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add authorization if API key is provided
      if (this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...request,
          timestamp: new Date().toISOString(),
          source: "ai-recipe-generator",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`n8n API error: ${response.status} - ${errorText}`)
      }

      const recipe = await response.json()

      // Validate required fields
      this.validateRecipeResponse(recipe)

      return recipe
    } catch (error) {
      console.error("N8n client error:", error)
      throw new Error(`Failed to generate recipe via n8n: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private validateRecipeResponse(recipe: any): void {
    const requiredFields = ["title", "ingredients", "instructions"]
    const missingFields = requiredFields.filter((field) => !recipe[field])

    if (missingFields.length > 0) {
      throw new Error(`Invalid recipe response: missing fields ${missingFields.join(", ")}`)
    }

    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      throw new Error("Recipe must have at least one ingredient")
    }

    if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
      throw new Error("Recipe must have at least one instruction")
    }
  }

  // Method to test n8n connection
  async testConnection(): Promise<boolean> {
    try {
      const testPayload = {
        type: "test" as const,
        input: "connection test",
        userId: "test-user",
        timestamp: new Date().toISOString(),
      }

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(testPayload),
      })

      return response.ok
    } catch (error) {
      console.error("N8n connection test failed:", error)
      return false
    }
  }
}

export const n8nClient = new N8nClient()
