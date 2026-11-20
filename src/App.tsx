import { useEffect, useState } from 'react'
import { Loading, Theme } from '@carbon/react'
import { Analytics } from '@vercel/analytics/react'
import { AnimatedRoutes } from './components/AnimatedRoutes'
import { AppHeader } from './components/AppHeader'
import { ContentErrorState } from './components/ContentErrorState'
import { Footer } from './components/Footer'
import { loadContent } from './content/loadContent'
import type { ContentState } from './content/types'
import { ContentContext } from './hooks/useContent'

export default function App() {
  const [state, setState] = useState<ContentState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    loadContent()
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Unable to validate portfolio content',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Theme theme="g100">
      <ContentContext.Provider value={state}>
        <div className="page-shell">
          {state.status === 'ready' ? <AppHeader /> : null}
          <main className="page-main" id="main-content">
            <div className="content-shell">
              {state.status === 'loading' ? (
                <Loading description="Loading portfolio content" withOverlay={false} />
              ) : null}
              {state.status === 'error' ? <ContentErrorState message={state.message} /> : null}
              {state.status === 'ready' ? <AnimatedRoutes /> : null}
            </div>
          </main>
          {state.status === 'ready' ? <Footer /> : null}
          <Analytics />
        </div>
      </ContentContext.Provider>
    </Theme>
  )
}
