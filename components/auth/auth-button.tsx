"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AuthButtonProps {
  user: SupabaseUser | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured. Check your .env.local file.")
      }
      const redirectTo =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/auth/callback"
    : "https://fatima-ai-recipe-generator-lapf0vrba-fatimas-projects-877cc0df.vercel.app/api/auth/callback"

     const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo,
    queryParams: { access_type: "offline", prompt: "consent" },
  },
})


      if (error) throw error
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.includes("redirect_uri_mismatch")
            ? "OAuth redirect URL mismatch. Fix it in your Supabase provider settings."
            : error.message
          : "Failed to sign in."

      toast({
        title: "Authentication Error",
        description: message,
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
      if (error) throw error

      router.refresh()
      toast({ title: "Signed out", description: "You have been signed out." })
    } catch {
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
          <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                alt={user.user_metadata?.full_name || "User"}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="p-2">
            <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
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
