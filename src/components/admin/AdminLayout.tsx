import { useState, useCallback } from "react"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleOpen = useCallback(() => setSidebarOpen(true), [])
  const handleClose = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="flex min-h-screen bg-black">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:w-60 md:flex-shrink-0"
        aria-label="Menu lateral"
      >
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegacao">
            <motion.div
              className="fixed inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              aria-hidden="true"
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-60"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <AdminSidebar onClose={handleClose} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <AdminHeader onMenuClick={handleOpen} />
        <main className="flex-1 overflow-y-auto p-6" id="main-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
