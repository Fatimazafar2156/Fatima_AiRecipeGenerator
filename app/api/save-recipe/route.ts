import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    console.log("Save recipe API called")

    // Check if environment variables are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing Supabase environment variables",
        },
        { status: 500 },
      )
    }

    const supabase = createRouteHandlerClient({ cookies: cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("User check:", user ? `User ID: ${user.id}` : "No user found")

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "You must be signed in to save recipes",
        },
        { status: 401 },
      )
    }

    const recipe = await request.json()
    console.log("Recipe data received:", {
      title: recipe.title,
      hasIngredients: !!recipe.ingredients,
      hasInstructions: !!recipe.instructions,
      ingredientsCount: recipe.ingredients?.length || 0,
      instructionsCount: recipe.instructions?.length || 0,
    })

    // Validate required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      console.error("Missing required fields:", {
        hasTitle: !!recipe.title,
        hasIngredients: !!recipe.ingredients,
        hasInstructions: !!recipe.instructions,
      })
      return NextResponse.json(
        {
          error: "Invalid recipe data",
          details: "Missing required recipe fields (title, ingredients, instructions)",
        },
        { status: 400 },
      )
    }

    // Ensure ingredients and instructions are arrays
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [recipe.ingredients]
    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [recipe.instructions]

    // Filter out empty items
    const validIngredients = ingredients.filter((item: string) => item && typeof item === "string" && item.trim().length > 0)
    const validInstructions = instructions.filter((item: string) => item && typeof item === "string" && item.trim().length > 0)

    if (validIngredients.length === 0 || validInstructions.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid recipe data",
          details: "Recipe must have at least one ingredient and one instruction",
        },
        { status: 400 },
      )
    }

    console.log("Attempting to save to database...")

    // Check if recipes table exists by trying to insert
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        user_id: user.id,
        title: recipe.title,
        description: recipe.description || "A delicious recipe",
        cooking_time: recipe.cookingTime || "30 minutes",
        servings: Number(recipe.servings) || 4,
        difficulty: recipe.difficulty || "Medium",
        ingredients: validIngredients,
        instructions: validInstructions,
      })
      .select()
      .single()

   // ...existing code...
      if (error) {
        console.error("Supabase error saving recipe:", error)
  
        // Defensive: error.message may not exist or error may not be an object
        const errorMsg =
          error && typeof error === "object" && typeof (error as any).message === "string"
            ? (error as any).message
            : ""
  
        // Check if it's a table not found error
        if (errorMsg.includes("relation") && errorMsg.includes("does not exist")) {
          return NextResponse.json(
            {
              error: "Database not set up",
              details:
                "The recipes table does not exist in your Supabase database. Please run the database setup script first.",
              supabaseError: error,
            },
            { status: 500 },
          )
        }
  
        // Check if it's an authentication error
        if (errorMsg.includes("JWT") || errorMsg.includes("auth")) {
          return NextResponse.json(
            {
              error: "Authentication error",
              details: "Please sign in again to save recipes.",
              supabaseError: error,
            },
            { status: 401 },
          )
        }
  
        // Check for RLS policy errors
        if (errorMsg.includes("policy") || errorMsg.includes("RLS")) {
          return NextResponse.json(
            {
              error: "Permission denied",
              details: "Database security policies prevent saving. Please check your Supabase RLS configuration.",
              supabaseError: error,
            },
            { status: 403 },
          )
        }
  
        // Generic error fallback
        return NextResponse.json(
          {
            error: "Database error",
            details: errorMsg || "Unknown database error",
            supabaseError: error,
          },
          { status: 500 },
        )
      }
  
      // Success response
      return NextResponse.json(
        {
          success: true,
          recipe: data,
        },
        { status: 200 },
      )
    } catch (err) {
      console.error("Unexpected error saving recipe:", err)
      return NextResponse.json(
        {
          error: "Unexpected server error",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      )
    }
}
