"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { ModeToggle } from "@/components/mode-toggle"
import { ChefHat, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Inline AuthButton component to avoid import issues
function AuthButton({ user }: { user: SupabaseUser | null }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Check if we have the required environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured. Please check your environment variables.")
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }
    } catch (error) {
      console.error("Auth error:", error)

      let errorMessage = "Failed to sign in with Google. Please try again."

      if (error instanceof Error) {
        if (error.message.includes("not configured")) {
          errorMessage = error.message
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage =
            "Google OAuth is not properly configured in Supabase. Please check your Supabase Authentication settings."
        } else if (error.message.includes("redirect_uri_mismatch")) {
          errorMessage = "OAuth redirect URL mismatch. Please check your Google OAuth configuration in Supabase."
        } else if (error.message.includes("OAuth")) {
          errorMessage =
            "Google OAuth is not configured in Supabase. Please set up Google OAuth in your Supabase dashboard under Authentication > Providers."
        }
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      router.refresh()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"}
                alt={user.user_metadata?.full_name || "User"}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  )
}

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        // "Auth session missing!" is expected when user is not signed in
        if (error && error.message !== "Auth session missing!") {
          console.error("Auth error:", error)
          setAuthError(error.message)
        } else {
          setUser(user)
          setAuthError(null)
        }
      } catch (error) {
        console.error("Supabase configuration error:", error)
        setAuthError(error instanceof Error ? error.message : "Authentication service unavailable")
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email || "no user")
      setUser(session?.user ?? null)
      setAuthError(null) // Clear any previous errors when auth state changes
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-lg">AI Recipe Generator</span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-lg">AI Recipe Generator</span>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {authError ? (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
              Auth Error: {authError}
            </div>
          ) : (
            <AuthButton user={user} />
          )}
        </div>
      </div>
    </header>
  )
}
