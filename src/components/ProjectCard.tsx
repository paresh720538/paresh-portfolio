import { Tag, Button } from '@carbon/react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '../content/types'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = {
  project: Project
}

export function ProjectCard({ project }: Props) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.article
      className="surface-tile project-card"
      layout={!reduced}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="project-card__title">{project.title}</h2>
      <p className="project-card__subtitle">{project.subtitle}</p>
      <p className="project-card__body">{project.summary}</p>
      <div className="tag-row">
        {project.tags.slice(0, 4).map((tag) => (
          <Tag key={tag} type="cool-gray">
            {tag}
          </Tag>
        ))}
      </div>
      <div className="project-card__cta">
        <Button kind="ghost" as={Link} to={`/projects/${project.slug}`}>
          View case study
        </Button>
      </div>
    </motion.article>
  )
}
