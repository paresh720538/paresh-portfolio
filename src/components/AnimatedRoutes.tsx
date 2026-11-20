import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Location } from 'react-router-dom'
import { Loading } from '@carbon/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const ProjectsPage = lazy(() =>
  import('../pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('../pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)
const ExperiencePage = lazy(() =>
  import('../pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })),
)
const ResumePage = lazy(() =>
  import('../pages/ResumePage').then((m) => ({ default: m.ResumePage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function AppRoutes({ location }: { location: Location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function RoutePane({ location }: { location: Location }) {
  return (
    <motion.div
      className="page-transition-pane"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%' }}
    >
      <Suspense fallback={<Loading description="Loading page" withOverlay={false} />}>
        <AppRoutes location={location} />
      </Suspense>
    </motion.div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function AnimatedRoutes() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <ScrollToTop />
      {reduced ? (
        <Suspense fallback={<Loading description="Loading page" withOverlay={false} />}>
          <AppRoutes location={location} />
        </Suspense>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <RoutePane key={location.pathname} location={location} />
        </AnimatePresence>
      )}
    </>
  )
}
