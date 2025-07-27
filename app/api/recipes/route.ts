import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "You must be signed in to view recipes" }, { status: 401 })
    }

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching recipes:", error)

      // Check if it's a table not found error
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "Database not set up. Please run the database setup script first.",
            details: "The recipes table does not exist in your Supabase database.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "Failed to fetch recipes",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Transform the data to match the frontend interface
    const transformedRecipes = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      cookingTime: recipe.cooking_time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      created_at: recipe.created_at,
    }))

    return NextResponse.json(transformedRecipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch recipes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
