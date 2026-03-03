import { Component } from "react"
import { useRouteError, isRouteErrorResponse } from "react-router-dom"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly error: Error | null
}

interface ErrorBoundaryProps {
  readonly children: React.ReactNode
  readonly fallback?: React.ReactNode
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          message={this.state.error?.message}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  readonly message?: string
  readonly onRetry?: () => void
  readonly showHomeLink?: boolean
}

function ErrorFallback({
  message,
  onRetry,
  showHomeLink = true,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-5">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(231,76,60,0.1)]">
          <AlertTriangle className="h-8 w-8 text-[#E74C3C]" />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-white">
          Algo deu errado
        </h1>

        <p className="mb-6 text-sm text-[rgba(255,255,255,0.5)]">
          {message ?? "Ocorreu um erro inesperado. Tente novamente."}
        </p>

        <div className="flex items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-2 rounded-lg bg-[rgba(210,182,138,0.1)] px-4 py-2.5 text-sm font-medium text-[#D2B68A] transition-colors hover:bg-[rgba(210,182,138,0.2)]"
            >
              <RotateCcw className="h-4 w-4" />
              Tentar novamente
            </button>
          )}

          {showHomeLink && (
            <a
              href="/"
              className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[#B7B7B7] transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Home className="h-4 w-4" />
              Inicio
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function RouteErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black px-5">
          <div className="w-full max-w-md text-center">
            <p className="mb-2 text-6xl font-bold text-[#D2B68A]">404</p>
            <h1 className="mb-2 text-xl font-semibold text-white">
              Pagina nao encontrada
            </h1>
            <p className="mb-6 text-sm text-[rgba(255,255,255,0.5)]">
              A pagina que voce procura nao existe ou foi movida.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[rgba(210,182,138,0.1)] px-4 py-2.5 text-sm font-medium text-[#D2B68A] transition-colors hover:bg-[rgba(210,182,138,0.2)]"
            >
              <Home className="h-4 w-4" />
              Voltar ao inicio
            </a>
          </div>
        </div>
      )
    }

    return (
      <ErrorFallback
        message={`Erro ${error.status}: ${error.statusText}`}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const message =
    error instanceof Error ? error.message : "Erro inesperado."

  return (
    <ErrorFallback
      message={message}
      onRetry={() => window.location.reload()}
    />
  )
}
