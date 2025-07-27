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

    const supabase = createRouteHandlerClient({
      cookies,
      supabaseUrl,
      supabaseKey,
    })

    // Test the connection by trying to get the current user
    // "Auth session missing!" is expected when no user is signed in
    const { data, error } = await supabase.auth.getUser()

    if (error && error.message !== "Auth session missing!") {
      return NextResponse.json({
        connected: false,
        error: `Supabase connection error: ${error.message}`,
        timestamp: new Date().toISOString(),
      })
    }

    // Test database connection by checking if we can query the recipes table
    const { error: dbError } = await supabase.from("recipes").select("count", { count: "exact", head: true })

    if (dbError) {
      return NextResponse.json({
        connected: true,
        warning: `Database table not found: ${dbError.message}. You may need to run the setup script.`,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      connected: true,
      message: "Supabase connection successful",
      userSignedIn: !!data.user,
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
