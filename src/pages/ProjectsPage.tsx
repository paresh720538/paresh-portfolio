import { useMemo, useCallback, type KeyboardEvent } from 'react'
import { Column, Grid, Tag } from '@carbon/react'
import { LayoutGroup, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { Seo } from '../components/Seo'
import { getAllTags } from '../content/loadContent'
import { useContent } from '../hooks/useContent'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { Reveal } from '../motion/Motion'

export function ProjectsPage() {
  const data = useContent()
  const tags = useMemo(() => getAllTags(data), [data])
  const [params, setParams] = useSearchParams()
  const active = params.get('tag')
  const reduced = usePrefersReducedMotion()

  const projects = useMemo(() => {
    const list = [...data.projects.projects].sort((a, b) => a.order - b.order)
    if (!active) return list
    return list.filter((p) => p.tags.includes(active))
  }, [data.projects.projects, active])

  const setFilter = useCallback(
    (tag: string | null) => {
      const next = new URLSearchParams(params)
      if (!tag) next.delete('tag')
      else next.set('tag', tag)
      setParams(next, { replace: true })
    },
    [params, setParams],
  )

  const onFilterKey = (tag: string | null) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFilter(tag)
    }
  }

  return (
    <>
      <Seo
        title="Projects"
        description="Filterable case studies and project summaries by Paresh Tripathy."
        path="/projects"
      />
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <Reveal>
            <header className="page-header">
              <h1 className="hero__title">
                <span className="hero__name">Projects</span>
              </h1>
              <p className="section__lede">
                Filter by role-relevant tags. Featured case studies include architecture diagrams
                and measured outcomes.
              </p>
            </header>
          </Reveal>
          <div className="filter-bar" role="toolbar" aria-label="Project filters">
            <Tag
              type={active === null ? 'blue' : 'cool-gray'}
              onClick={() => setFilter(null)}
              onKeyDown={onFilterKey(null)}
              className="filter-bar__tag"
              role="button"
              tabIndex={0}
              aria-pressed={active === null}
            >
              All
            </Tag>
            {tags.map((tag) => (
              <Tag
                key={tag}
                type={active === tag ? 'blue' : 'cool-gray'}
                onClick={() => setFilter(tag)}
                onKeyDown={onFilterKey(tag)}
                className="filter-bar__tag"
                role="button"
                tabIndex={0}
                aria-pressed={active === tag}
              >
                {tag}
              </Tag>
            ))}
          </div>
          <LayoutGroup>
            <motion.div className="card-grid" layout={!reduced}>
              {projects.map((project) => (
                <motion.div key={project.slug} layout={!reduced}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
          {projects.length === 0 ? (
            <p className="section__lede">No projects match this filter.</p>
          ) : null}
        </Column>
      </Grid>
    </>
  )
}
