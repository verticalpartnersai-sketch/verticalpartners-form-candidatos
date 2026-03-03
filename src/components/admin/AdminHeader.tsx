import { Menu } from "lucide-react"

interface AdminHeaderProps {
  readonly onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[rgba(183,183,183,0.1)] bg-[#0A0E1A] px-4 py-3">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-[#B7B7B7] transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B68A] md:hidden"
        aria-label="Abrir menu de navegacao"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <span className="text-xs text-[#B7B7B7] hidden sm:inline" />
      </div>
    </header>
  )
}
