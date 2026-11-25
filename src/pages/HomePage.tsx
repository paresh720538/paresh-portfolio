import { Button, Column, Grid } from '@carbon/react'
import { Link } from 'react-router-dom'
import { BootIntro } from '../components/BootIntro'
import { ContactPanel } from '../components/ContactPanel'
import { ExperienceTimeline } from '../components/ExperienceTimeline'
import { Hero } from '../components/Hero'
import { MetricStrip } from '../components/MetricStrip'
import { ProjectCard } from '../components/ProjectCard'
import { Seo } from '../components/Seo'
import { SkillGroup } from '../components/SkillGroup'
import { getFeaturedProjects } from '../content/loadContent'
import { useContent } from '../hooks/useContent'
import { MotionItem, Reveal, Stagger } from '../motion/Motion'

export function HomePage() {
  const data = useContent()
  const featured = getFeaturedProjects(data)

  return (
    <>
      <Seo path="/" />
      <BootIntro />
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <Hero />
          <MetricStrip metrics={data.profile.metrics} className="section--after-hero" />

          <Reveal>
            <section className="section" aria-labelledby="about-title">
              <h2 id="about-title" className="section__title section__title--rule">
                About Paresh Tripathy
              </h2>
              <p className="section__lede">{data.profile.summary}</p>
            </section>
          </Reveal>

          <Reveal>
            <SkillGroup groups={data.skills.groups} />
          </Reveal>

          <section className="section" aria-labelledby="featured-title">
            <Reveal>
              <h2 id="featured-title" className="section__title section__title--rule">
                Featured case studies
              </h2>
              <p className="section__lede">
                Klosiq, Retyre, and CRS — systems where backend, cloud, and product delivery meet.
              </p>
            </Reveal>
            <Stagger className="card-grid card-grid--featured" mode="cards">
              {featured.map((project) => (
                <MotionItem key={project.slug}>
                  <ProjectCard project={project} />
                </MotionItem>
              ))}
            </Stagger>
            <Reveal className="section__actions">
              <Button kind="tertiary" as={Link} to="/projects">
                {data.site.cta.projects}
              </Button>
            </Reveal>
          </section>

          <Reveal>
            <ExperienceTimeline
              roles={data.experience.roles}
              limit={3}
              ctaHref="/experience"
              ctaLabel="View full experience"
            />
          </Reveal>

          <section className="section" aria-labelledby="how-title">
            <Reveal>
              <h2 id="how-title" className="section__title section__title--rule">
                How I engineer
              </h2>
              <p className="section__lede">
                Principles I use when designing services, platforms, and delivery pipelines.
              </p>
            </Reveal>
            <Stagger className="engineer-grid" mode="cards">
              {data.site.howIEngineer.map((item) => (
                <MotionItem key={item.title} className="surface-tile">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </MotionItem>
              ))}
            </Stagger>
          </section>

          <Reveal>
            <ContactPanel />
          </Reveal>
        </Column>
      </Grid>
    </>
  )
}
