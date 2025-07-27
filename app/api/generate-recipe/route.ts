import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { type, input } = await request.json()

    if (!type || !input) {
      return NextResponse.json({ error: "Missing required fields: type and input" }, { status: 400 })
    }

    console.log("Generating recipe:", { type, input })

    // First, try n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (n8nWebhookUrl && n8nWebhookUrl !== "https://your-n8n-instance.com/webhook/recipe-generator") {
      try {
        console.log("Trying n8n webhook:", n8nWebhookUrl)

        const n8nPayload = {
          type,
          input,
          userId: user?.id || "anonymous",
          userEmail: user?.email || "anonymous@example.com",
          timestamp: new Date().toISOString(),
          source: "ai-recipe-generator",
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        }

        if (process.env.N8N_API_KEY && process.env.N8N_API_KEY !== "your-n8n-api-key-optional") {
          headers["Authorization"] = `Bearer ${process.env.N8N_API_KEY}`
        }

        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(n8nPayload),
          signal: AbortSignal.timeout(15000), // 15 second timeout
        })

        if (n8nResponse.ok) {
          const recipe = await n8nResponse.json()
          console.log("N8N recipe generated successfully")

          // Validate the response
          if (recipe.title && recipe.ingredients && recipe.instructions) {
            return NextResponse.json(recipe)
          } else {
            console.log("Invalid n8n response, falling back to direct API")
          }
        } else {
          console.log("N8N webhook failed with status:", n8nResponse.status)
        }
      } catch (n8nError) {
        console.error("N8N webhook error:", n8nError)
      }
    }

    // If n8n fails, use Google Gemini API directly
    const geminiApiKey = process.env.GOOGLE_GENAI_API_KEY

    if (!geminiApiKey || geminiApiKey === "your_google_genai_api_key") {
      return NextResponse.json(
        { error: "No recipe generation method available. Please configure N8N_WEBHOOK_URL or GOOGLE_GENAI_API_KEY." },
        { status: 500 },
      )
    }

    console.log("Using Google Gemini API directly")

    try {
      const prompt =
        type === "ingredients"
          ? `Create a recipe using these ingredients: ${input}. Use them as the main components of the dish.`
          : `Create a traditional recipe for: ${input}. Provide a complete recipe with ingredients and instructions.`

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiApiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "Recipe Name",
  "description": "Brief description of the dish",
  "cookingTime": "30 minutes",
  "servings": 4,
  "difficulty": "Easy",
  "ingredients": ["ingredient 1 with measurement", "ingredient 2 with measurement"],
  "instructions": ["Step 1 instruction", "Step 2 instruction"]
}

No markdown formatting, no additional text, just the JSON object.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        },
      )

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        console.error("Gemini API error:", geminiResponse.status, errorText)
        throw new Error(`Gemini API failed: ${geminiResponse.status}`)
      }

      const geminiData = await geminiResponse.json()
      console.log("Gemini API response received")

      if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
        throw new Error("Invalid Gemini API response structure")
      }

      let generatedText = geminiData.candidates[0].content.parts[0].text
      generatedText = generatedText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      let recipe
      try {
        recipe = JSON.parse(generatedText)
      } catch (parseError) {
        // Try to extract JSON from the text
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          recipe = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("Could not parse JSON from Gemini response")
        }
      }

      // Validate and format the recipe
      if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
        throw new Error("Missing required fields in recipe")
      }

      // Ensure arrays are properly formatted
      if (!Array.isArray(recipe.ingredients)) {
        recipe.ingredients = [recipe.ingredients]
      }

      if (!Array.isArray(recipe.instructions)) {
        recipe.instructions = [recipe.instructions]
      }

      // Set defaults
      recipe.description = recipe.description || "A delicious homemade recipe"
      recipe.cookingTime = recipe.cookingTime || "30 minutes"
      recipe.servings = Number(recipe.servings) || 4
      recipe.difficulty = recipe.difficulty || "Medium"

      if (!["Easy", "Medium", "Hard"].includes(recipe.difficulty)) {
        recipe.difficulty = "Medium"
      }

      // Add metadata
      recipe.generatedAt = new Date().toISOString()
      recipe.source = "google-gemini-direct"
      recipe.model = "gemini-1.5-flash"
      recipe.userId = user?.id || "anonymous"

      console.log("Recipe generated successfully via Gemini API")
      return NextResponse.json(recipe)
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)
      return NextResponse.json(
        {
          error: "Failed to generate recipe",
          details: geminiError instanceof Error ? geminiError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating recipe:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recipe",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
