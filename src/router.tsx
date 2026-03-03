import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import { SelectPosition } from "@/pages/SelectPosition"
import { FormPage } from "@/pages/FormPage"
import { AuthGuard } from "@/components/admin/AuthGuard"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { RouteErrorBoundary } from "@/components/ErrorBoundary"

const AdminLogin = lazy(() =>
  import("@/pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })),
)
const ApplicationList = lazy(() =>
  import("@/pages/admin/ApplicationList").then((m) => ({
    default: m.ApplicationList,
  })),
)
const ApplicationDetail = lazy(() =>
  import("@/pages/admin/ApplicationDetail").then((m) => ({
    default: m.ApplicationDetail,
  })),
)
const Statistics = lazy(() =>
  import("@/pages/admin/Statistics").then((m) => ({ default: m.Statistics })),
)
const Comparative = lazy(() =>
  import("@/pages/admin/Comparative").then((m) => ({
    default: m.Comparative,
  })),
)

function LazyFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black"
      role="status"
      aria-label="Carregando"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
    </div>
  )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SelectPosition />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/form/:positionId",
    element: <FormPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <AdminLogin />
          </SuspenseWrapper>
        ),
      },
      {
        element: (
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <SuspenseWrapper>
                <ApplicationList />
              </SuspenseWrapper>
            ),
          },
          {
            path: "candidate/:id",
            element: (
              <SuspenseWrapper>
                <ApplicationDetail />
              </SuspenseWrapper>
            ),
          },
          {
            path: "stats",
            element: (
              <SuspenseWrapper>
                <Statistics />
              </SuspenseWrapper>
            ),
          },
          {
            path: "compare",
            element: (
              <SuspenseWrapper>
                <Comparative />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
])
