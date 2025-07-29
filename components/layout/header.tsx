"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { ChefHat } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import AuthButton from "@/components/auth/auth-button"

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error && error.message !== "Auth session missing!") {
          setAuthError(error.message)
        } else {
          setUser(data.user ?? null)
        }
      } catch (err) {
        setAuthError("Failed to retrieve user session.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthError(null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-lg">AI Recipe Generator</span>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {loading ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : authError ? (
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
