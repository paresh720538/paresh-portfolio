import { Tag, Button } from '@carbon/react'
import { Link } from 'react-router-dom'
import type { Experience } from '../content/types'
import { useContent } from '../hooks/useContent'

type Props = {
  roles: Experience['roles']
  education?: Experience['education']
  limit?: number
  showEducation?: boolean
  /** When false, skip the section H2 (page already has a title). */
  showHeading?: boolean
  heading?: string
  ctaHref?: string
  ctaLabel?: string
}

function formatRange(start: string, end: string | null, current: boolean) {
  const label = (value: string) => {
    const [y, m] = value.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[Number(m) - 1]} ${y}`
  }
  return `${label(start)} – ${current || !end ? 'Present' : label(end)}`
}

export function ExperienceTimeline({
  roles,
  education = [],
  limit,
  showEducation = false,
  showHeading = true,
  heading = 'Experience',
  ctaHref,
  ctaLabel,
}: Props) {
  const { projects } = useContent()
  const items = limit ? roles.slice(0, limit) : roles
  const titleBySlug = Object.fromEntries(projects.projects.map((p) => [p.slug, p.title]))

  return (
    <section className="section" aria-labelledby={showHeading ? 'experience-title' : undefined}>
      {showHeading ? (
        <h2 id="experience-title" className="section__title section__title--rule">
          {heading}
        </h2>
      ) : null}
      {items.map((role) => (
        <article key={role.id} className="timeline-item">
          <div className="timeline-item__meta">
            {formatRange(role.start, role.end, role.current)} · {role.location}
          </div>
          <h3>
            {role.title} · {role.company}
          </h3>
          <p>{role.summary}</p>
          <ul className="content-list">
            {role.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {role.projectIds.length > 0 ? (
            <div className="timeline-item__projects">
              {role.projectIds.map((slug) => (
                <Link key={slug} to={`/projects/${slug}`} className="timeline-item__project-link">
                  {titleBySlug[slug] ?? slug} →
                </Link>
              ))}
            </div>
          ) : null}
          <div className="tag-row">
            {role.techStack.map((tech) => (
              <Tag key={tech} type="cool-gray">
                {tech}
              </Tag>
            ))}
          </div>
        </article>
      ))}

      {showEducation
        ? education.map((edu) => (
            <article key={`${edu.institution}-${edu.degree}`} className="timeline-item">
              <div className="timeline-item__meta">
                {formatRange(edu.start, edu.end, false)}
              </div>
              <h3>
                {edu.degree} · {edu.institution}
              </h3>
              {edu.detail ? <p>{edu.detail}</p> : null}
            </article>
          ))
        : null}

      {ctaHref && ctaLabel ? (
        <div className="section__actions">
          <Button kind="tertiary" as={Link} to={ctaHref}>
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </section>
  )
}
