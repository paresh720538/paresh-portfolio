import { Button } from '@carbon/react'
import { useContent } from '../hooks/useContent'

export function ContactPanel() {
  const { profile, site } = useContent()
  const hasCalendar = Boolean(profile.calendarUrl)
  const primaryHref = hasCalendar
    ? profile.calendarUrl
    : `mailto:${profile.email}?subject=${encodeURIComponent('Senior role discussion — Paresh Tripathy')}`
  const primaryLabel = hasCalendar ? site.cta.availability : site.cta.secondary

  return (
    <section
      className="section section--flush-bottom contact-band contact-band--premium"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className="section__title">
        Let’s talk
      </h2>
      <p className="section__lede">
        Based in {profile.location}. {profile.availability}
      </p>
      <div className="contact-band__actions">
        <Button
          href={primaryHref}
          target={hasCalendar ? '_blank' : undefined}
          rel={hasCalendar ? 'noreferrer' : undefined}
        >
          {primaryLabel}
        </Button>
        <Button kind="tertiary" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </Button>
        <div className="contact-band__links">
          {hasCalendar ? <a href={`mailto:${profile.email}`}>Email</a> : null}
          {profile.github ? (
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          {profile.phone ? (
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>Call</a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
