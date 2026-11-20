import { Button, InlineNotification } from '@carbon/react'

type Props = {
  message: string
}

const FALLBACK_EMAIL = 'pareshtripathy071@gmail.com'

export function ContentErrorState({ message }: Props) {
  return (
    <div className="content-error">
      <InlineNotification
        kind="error"
        title="Content unavailable"
        subtitle={message}
        lowContrast
        hideCloseButton
      />
      <p className="content-error__copy">
        Navigation and contact remain available. Please retry or email directly.
      </p>
      <div className="hero__actions content-error__actions">
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Button kind="tertiary" href={`mailto:${FALLBACK_EMAIL}`}>
          Email
        </Button>
      </div>
    </div>
  )
}
