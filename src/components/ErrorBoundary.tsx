import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@carbon/react'

type Props = { children: ReactNode }
type State = { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unexpected application error' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio error boundary', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="content-error">
        <h1 className="section__title">Something went wrong</h1>
        <p className="content-error__copy">{this.state.message}</p>
        <div className="hero__actions content-error__actions">
          <Button onClick={() => window.location.assign('/')}>Return home</Button>
          <Button kind="tertiary" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    )
  }
}
