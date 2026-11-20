import { Button } from '@carbon/react'
import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'

export function ContactPanel() {
  const { profile, site } = useContent()

  return (
    <section
      className="section section--flush-bottom contact-band contact-band--premium"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className="section__title">
        Let’s talk
      </h2>
      <p className="section__lede">
        Based in {profile.location}. Prefer email for opportunities; LinkedIn for networking.
      </p>
      <div className="contact-band__actions">
        <Button href={`mailto:${profile.email}`}>{site.cta.secondary}</Button>
        <Button kind="tertiary" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </Button>
        {profile.github ? (
          <Button kind="tertiary" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </Button>
        ) : null}
        <Button kind="tertiary" as={Link} to="/resume">
          {site.cta.primary}
        </Button>
        {profile.phone ? (
          <Button kind="ghost" href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
            Call
          </Button>
        ) : null}
      </div>
    </section>
  )
}
