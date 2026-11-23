import { Button } from '@carbon/react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { softClick } from '../lib/softNavigate'

export function ContactPanel() {
  const { profile, site } = useContent()
  const navigate = useNavigate()

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
        <Button
          kind="tertiary"
          href="/resume"
          onClick={(e) => softClick(e, navigate, '/resume')}
        >
          {site.cta.primary}
        </Button>
        <div className="contact-band__links">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
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
