import { motion } from "framer-motion"

export function CalculatingScreen() {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Spinner */}
      <div className="relative mb-8 h-16 w-16">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(210, 182, 138, 0.1)",
          }}
        />
        {/* Spinning arc */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#D2B68A",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Inner pulse */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{ background: "rgba(210, 182, 138, 0.08)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.h2
        className="mb-2 text-xl font-semibold text-text-primary"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Calculando seu perfil...
      </motion.h2>

      <motion.p
        className="text-sm text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Analisando suas respostas comportamentais
      </motion.p>

      {/* Animated dots */}
      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-gold"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
