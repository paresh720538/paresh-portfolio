import { Button, Tag } from '@carbon/react'
import type { Project } from '../content/types'
import { useContent } from '../hooks/useContent'
import { Reveal } from '../motion/Motion'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { MetricStrip } from './MetricStrip'

type Props = {
  project: Project
}

export function CaseStudy({ project }: Props) {
  const { profile, site } = useContent()
  const discussHref = profile.calendarUrl
    ? profile.calendarUrl
    : `mailto:${profile.email}?subject=${encodeURIComponent(`Discussion: ${project.title}`)}`

  return (
    <article className="case-study">
      <header className="case-study__sticky">
        <p className="hero__eyebrow">
          {project.role} · {project.timeframe}
        </p>
        <h1 className="hero__title case-study__title">
          <span className="hero__name">{project.title}</span>
          <span className="hero__role">{project.subtitle}</span>
        </h1>
        <p className="section__lede case-study__summary">{project.summary}</p>
      </header>

      <Reveal className="section">
        <h2 className="section__title section__title--rule">Challenge</h2>
        <p className="prose">{project.challenge}</p>
      </Reveal>

      <Reveal className="section">
        <h2 className="section__title section__title--rule">Responsibilities</h2>
        <ul className="content-list">
          {project.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="section">
        <h2 className="section__title section__title--rule">Solution</h2>
        <ul className="content-list">
          {project.solution.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="section">
        <ArchitectureDiagram architecture={project.architecture} />
      </Reveal>

      <Reveal className="section">
        <h2 className="section__title section__title--rule">Technologies</h2>
        <div className="tag-row">
          {project.techStack.map((tech) => (
            <Tag key={tech} type="cool-gray">
              {tech}
            </Tag>
          ))}
        </div>
      </Reveal>

      {project.outcomes.length > 0 ? (
        <MetricStrip metrics={project.outcomes} title="Outcomes" />
      ) : null}

      <Reveal className="section">
        <h2 className="section__title section__title--rule">Confidentiality</h2>
        <p className="prose">{project.confidentialityNotes}</p>
      </Reveal>

      {project.links.length > 0 ? (
        <Reveal className="section">
          <h2 className="section__title section__title--rule">Links</h2>
          <ul className="content-list">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <Reveal className="section case-study__cta">
        <h2 className="section__title section__title--rule">Discuss this work</h2>
        <p className="section__lede">
          Open to senior backend, platform, and applied AI conversations about systems like{' '}
          {project.title}.
        </p>
        <div className="contact-band__actions">
          <Button
            href={discussHref}
            target={profile.calendarUrl ? '_blank' : undefined}
            rel={profile.calendarUrl ? 'noreferrer' : undefined}
          >
            {profile.calendarUrl ? site.cta.availability : site.cta.secondary}
          </Button>
          <Button kind="tertiary" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </Button>
        </div>
      </Reveal>
    </article>
  )
}
