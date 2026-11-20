import { Button, Column, Grid, InlineNotification } from '@carbon/react'
import { Link, useParams } from 'react-router-dom'
import { CaseStudy } from '../components/CaseStudy'
import { Seo } from '../components/Seo'
import { getProjectBySlug } from '../content/loadContent'
import { useContent } from '../hooks/useContent'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const data = useContent()
  const project = getProjectBySlug(data, slug)

  if (!project) {
    return (
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <InlineNotification
            kind="warning"
            title="Project not found"
            subtitle={`No case study matches “${slug}”.`}
            lowContrast
            hideCloseButton
          />
          <div className="section__actions">
            <Button as={Link} to="/projects">
              Back to projects
            </Button>
          </div>
        </Column>
      </Grid>
    )
  }

  return (
    <>
      <Seo title={project.title} description={project.summary} path={`/projects/${project.slug}`} />
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <Button kind="ghost" as={Link} to="/projects">
            ← All projects
          </Button>
          <CaseStudy project={project} />
        </Column>
      </Grid>
    </>
  )
}
