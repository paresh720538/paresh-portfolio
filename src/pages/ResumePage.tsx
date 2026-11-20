import { Button, Column, Grid } from '@carbon/react'
import { Seo } from '../components/Seo'
import { useContent } from '../hooks/useContent'
import { Reveal } from '../motion/Motion'

export function ResumePage() {
  const { profile } = useContent()

  return (
    <>
      <Seo
        title="Resume"
        description="Download or view Paresh Tripathy’s resume PDF."
        path="/resume"
      />
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <Reveal>
            <header className="page-header">
              <h1 className="hero__title">
                <span className="hero__name">Resume</span>
              </h1>
              <p className="section__lede">
                PDF resume for {profile.name}, {profile.title}. Includes Nuage Biztech (Klosiq,
                Retyre), Chetu India, and Hostmud CRS experience with substantiated metrics only.
              </p>
              <div className="hero__actions">
                <Button
                  as="a"
                  href={profile.resumeUrl}
                  download="Paresh_Tripathy_Resume.pdf"
                  className="hero__cta hero__cta--primary"
                >
                  Download PDF
                </Button>
                <Button
                  kind="tertiary"
                  as="a"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hero__cta hero__cta--secondary"
                >
                  Open in new tab
                </Button>
              </div>
            </header>
          </Reveal>

          <div className="resume-preview">
            <object
              className="resume-frame"
              data={`${profile.resumeUrl}#view=FitH`}
              type="application/pdf"
              aria-label={`${profile.name} resume PDF`}
            >
              <div className="resume-fallback">
                <p className="prose">
                  Inline PDF preview isn’t available in this browser. Download the file or open it
                  in a new tab.
                </p>
                <div className="hero__actions">
                  <Button
                    as="a"
                    href={profile.resumeUrl}
                    download="Paresh_Tripathy_Resume.pdf"
                    className="hero__cta hero__cta--primary"
                  >
                    Download PDF
                  </Button>
                  <Button
                    kind="tertiary"
                    as="a"
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hero__cta hero__cta--secondary"
                  >
                    Open in new tab
                  </Button>
                </div>
              </div>
            </object>
          </div>

          <section className="section" aria-labelledby="resume-alt">
            <h2 id="resume-alt" className="section__title section__title--rule">
              Text alternative
            </h2>
            <p className="prose">{profile.summary}</p>
            <ul className="content-list">
              {profile.metrics.map((m) => (
                <li key={m.label}>
                  <strong>{m.value}</strong> — {m.label}
                  {m.context ? ` (${m.context})` : ''}
                </li>
              ))}
            </ul>
          </section>
        </Column>
      </Grid>
    </>
  )
}
