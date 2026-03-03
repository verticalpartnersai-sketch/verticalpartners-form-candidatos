import { NavLink, useNavigate } from "react-router-dom"
import { Users, BarChart2, GitCompare, Download, X, LogOut } from "lucide-react"
import type { ComponentType } from "react"
import { useAuth } from "@/hooks/useAuth"

interface AdminSidebarProps {
  readonly onClose?: () => void
}

interface NavItem {
  readonly to: string
  readonly icon: ComponentType<{ className?: string }>
  readonly label: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: "/admin/dashboard", icon: Users, label: "Candidaturas" },
  { to: "/admin/stats", icon: BarChart2, label: "Estatisticas" },
  { to: "/admin/compare", icon: GitCompare, label: "Comparativo" },
]

function NavItemLink({ item }: { readonly item: NavItem }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B68A]",
          isActive
            ? "text-[#D2B68A] bg-[rgba(210,182,138,0.1)] border-l-2 border-[#D2B68A]"
            : "text-[#B7B7B7] hover:text-white border-l-2 border-transparent",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{item.label}</span>
    </NavLink>
  )
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await signOut()
      navigate("/admin", { replace: true })
    } catch {
      // signOut error is non-critical
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#0A0E1A] border-r border-[rgba(183,183,183,0.1)]">
      <div className="flex items-center justify-between px-4 py-5">
        <span className="text-sm font-semibold text-[#D2B68A]">
          VP Form Admin
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#B7B7B7] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B68A] md:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}

        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#B7B7B7] hover:text-white rounded-md transition-colors border-l-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B68A]"
        >
          <Download className="h-4 w-4 flex-shrink-0" />
          <span>Exportar CSV</span>
        </button>
      </nav>

      <div className="border-t border-[rgba(183,183,183,0.1)] p-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-2 py-2 text-sm text-[#B7B7B7] hover:text-white rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B68A]"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}
