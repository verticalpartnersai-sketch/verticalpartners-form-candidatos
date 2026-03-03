import { cn } from "@/lib/utils"

interface GlowCardProps {
  children: React.ReactNode
  className?: string
}

export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <div className={cn("relative", className)}>
      {/* External bottom glow — large diffused blue light beneath the card */}
      <div
        className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 h-[50%] w-[70%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56,120,255,0.55) 0%, rgba(30,100,255,0.3) 40%, rgba(0,100,255,0.1) 70%, transparent 100%)",
          filter: "blur(50px)",
        }}
      />

      {/* External side glows — subtle blue on bottom corners */}
      <div
        className="pointer-events-none absolute -bottom-2 -left-2 h-[40%] w-[30%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(40,100,255,0.25) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-2 -right-2 h-[40%] w-[30%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(40,100,255,0.25) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Card body */}
      <div
        className="relative overflow-hidden rounded-2xl backdrop-blur-[24px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,19,36,0.92) 0%, rgba(10,16,38,0.95) 60%, rgba(12,20,50,0.97) 100%)",
          border: "1px solid rgba(80,130,255,0.12)",
          boxShadow: [
            "inset 0 1px 0 0 rgba(255,255,255,0.06)",
            "inset 0 -1px 0 0 rgba(56,120,255,0.15)",
            "0 0 0 0.5px rgba(60,120,255,0.08)",
            "0 4px 24px rgba(0,0,0,0.4)",
            "0 20px 60px -10px rgba(0,0,0,0.5)",
          ].join(", "),
        }}
      >
        {/* Top inner highlight line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Bottom inner blue glow gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background:
              "linear-gradient(to top, rgba(40,100,255,0.08) 0%, transparent 100%)",
          }}
        />

        {/* Bottom inner blue edge line */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(56,120,255,0.35)] to-transparent" />

        {/* Left edge subtle blue */}
        <div
          className="pointer-events-none absolute left-0 bottom-0 h-[60%] w-px"
          style={{
            background:
              "linear-gradient(to top, rgba(56,120,255,0.2) 0%, transparent 100%)",
          }}
        />

        {/* Right edge subtle blue */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 h-[60%] w-px"
          style={{
            background:
              "linear-gradient(to top, rgba(56,120,255,0.2) 0%, transparent 100%)",
          }}
        />

        {children}
      </div>
    </div>
  )
}
