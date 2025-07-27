import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        connected: false,
        error: "Missing Supabase environment variables",
        timestamp: new Date().toISOString(),
      })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Test database connection by checking if recipes table exists
    const { data, error, count } = await supabase.from("recipes").select("*", { count: "exact", head: true })

    if (error) {
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json({
          connected: true,
          tableExists: false,
          error: "Recipes table does not exist. Please run the database setup script.",
          timestamp: new Date().toISOString(),
        })
      }

      return NextResponse.json({
        connected: false,
        error: `Database error: ${error.message}`,
        timestamp: new Date().toISOString(),
      })
    }

    // Test user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return NextResponse.json({
      connected: true,
      tableExists: true,
      recipeCount: count || 0,
      userSignedIn: !!user,
      userId: user?.id || null,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
