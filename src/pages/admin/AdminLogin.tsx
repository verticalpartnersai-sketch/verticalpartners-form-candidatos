import { useState, useCallback } from "react"
import { Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"

export function AdminLogin() {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.")
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const result = await signIn(email.trim(), password)

      if (!result.success) {
        setError(result.error ?? "Erro ao fazer login.")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }, [email, password, signIn])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !submitting) {
        handleSubmit()
      }
    },
    [handleSubmit, submitting],
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
        onKeyDown={handleKeyDown}
      >
        <div
          className="rounded-lg border border-border-gold p-8"
          style={{
            background: "linear-gradient(145deg, rgba(34,32,82,0.5) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        >
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-text-secondary">
              VERTICAL PARTNERS
            </p>
            <div className="mx-auto mb-4 h-px w-12 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <h1 className="text-xl font-semibold text-gold">
              VP Form Admin
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@verticalpartners.com.br"
              disabled={submitting}
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Sua senha"
              disabled={submitting}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-2 w-full"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          Vertical Partners &copy; 2026
        </p>
      </motion.div>
    </div>
  )
}
