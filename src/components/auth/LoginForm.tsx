import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthError } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSwitchToSignUp: () => void
}

const shouldRetry = (error: AuthError) => {
  const message = error.message.toLowerCase()
  return (
    error.status === 500 ||
    error.status === 502 ||
    error.status === 503 ||
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("timeout")
  )
}

const getLoginErrorMessage = (error: AuthError) => {
  const message = error.message.toLowerCase()

  if (error.status === 429 || message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again."
  }
  if (message.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again."
  }
  if (message.includes("email not confirmed")) {
    return "Please verify your email before signing in."
  }
  if (shouldRetry(error)) {
    return "Network issue. Please try again."
  }

  return error.message
}

const runAuthRequest = async (
  request: () => Promise<{ error: AuthError | null }>,
  retries = 1,
) => {
  let lastError: AuthError | null = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const { error } = await request()

    if (!error) {
      return { error: null }
    }

    lastError = error

    if (attempt < retries && shouldRetry(error)) {
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)))
      continue
    }
    break
  }

  return { error: lastError }
}

const LoginForm = ({ onSwitchToSignUp }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)

    try {
      const { error } = await runAuthRequest(() =>
        supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        }),
      )

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: getLoginErrorMessage(error),
        })
        return
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })

      navigate("/portal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your portal
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-medium text-primary hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
