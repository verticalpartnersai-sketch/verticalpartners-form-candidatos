import { useState, useCallback, useEffect, useRef } from "react"
import { DiscBlockCard } from "@/components/form/DiscBlockCard"
import { FormNavigationBar } from "@/components/form/FormNavigationBar"
import type { DiscBlock, DiscBlockAnswer, DiscFactor } from "@/types"

interface DiscQuestionProps {
  block: DiscBlock
  blockIndex: number
  totalBlocks: number
  answer: DiscBlockAnswer | null
  onAnswer: (blockId: number, answer: DiscBlockAnswer) => void
  onClear: (blockId: number) => void
  onNext: () => boolean
  onPrev: () => void
  isFirst: boolean
}

export function DiscQuestion({
  block,
  blockIndex,
  totalBlocks,
  answer,
  onAnswer,
  onClear,
  onNext,
  onPrev,
  isFirst,
}: DiscQuestionProps) {
  const [most, setMost] = useState<DiscFactor | null>(answer?.most ?? null)
  const [least, setLeast] = useState<DiscFactor | null>(answer?.least ?? null)
  const onNextRef = useRef(onNext)
  onNextRef.current = onNext

  // Sync local state only when navigating to a different block
  useEffect(() => {
    setMost(answer?.most ?? null)
    setLeast(answer?.least ?? null)
  }, [block.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = useCallback(
    (factor: DiscFactor) => {
      let newMost = most
      let newLeast = least

      if (factor === most) {
        newMost = null
      } else if (factor === least) {
        newLeast = null
      } else if (newMost === null) {
        newMost = factor
      } else {
        newLeast = factor
      }

      setMost(newMost)
      setLeast(newLeast)

      // Persist full answer to parent, or clear if incomplete
      if (newMost && newLeast && newMost !== newLeast) {
        onAnswer(block.id, { most: newMost, least: newLeast })
        setTimeout(() => onNextRef.current(), 400)
      } else {
        onClear(block.id)
      }
    },
    [most, least, block.id, onAnswer, onClear],
  )

  const getCardSelection = useCallback(
    (factor: DiscFactor): "most" | "least" | null => {
      if (factor === most) return "most"
      if (factor === least) return "least"
      return null
    },
    [most, least],
  )

  const isLast = blockIndex === totalBlocks - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="relative w-full max-w-[640px]">
        {/* Número decorativo */}
        <span
          className="pointer-events-none absolute -left-4 -top-12 select-none text-[80px] font-bold leading-none"
          style={{ color: "rgba(255,255,255,0.04)" }}
        >
          {String(blockIndex + 1).padStart(2, "0")}
        </span>

        {/* Label da seção */}
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
          Pergunta {blockIndex + 1} de {totalBlocks}
        </p>

        {/* Instrução */}
        <h2 className="mb-8 text-lg font-medium leading-snug text-text-primary sm:text-xl">
          Selecione a palavra que{" "}
          <span className="font-semibold text-gold">MAIS</span> e a que{" "}
          <span className="font-semibold text-electric-blue">MENOS</span>{" "}
          descreve você
        </h2>

        {/* Grid 2x2 (desktop) / 1 col (mobile) */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {block.options.map((option) => (
            <DiscBlockCard
              key={option.factor}
              label={option.label}
              selection={getCardSelection(option.factor)}
              onClick={() => handleCardClick(option.factor)}
            />
          ))}
        </div>

        {/* Navegação */}
        <FormNavigationBar
          onPrev={onPrev}
          onNext={onNext}
          isFirst={isFirst}
          isLast={isLast}
          questionType="disc_block"
        />
      </div>
    </div>
  )
}
