import type { ReactNode } from "react"

interface AdminCardProps {
  readonly children: ReactNode
  readonly title?: string
  readonly className?: string
}

export function AdminCard({ children, title, className = "" }: AdminCardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-[rgba(183,183,183,0.08)] bg-[#222052] p-5",
        className,
      ].join(" ")}
    >
      {title && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#B7B7B7]">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
