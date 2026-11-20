import { Column, Grid } from '@carbon/react'
import { ExperienceTimeline } from '../components/ExperienceTimeline'
import { Seo } from '../components/Seo'
import { SkillGroup } from '../components/SkillGroup'
import { useContent } from '../hooks/useContent'
import { Reveal } from '../motion/Motion'

export function ExperiencePage() {
  const data = useContent()

  return (
    <>
      <Seo
        title="Experience"
        description="Career timeline, skills, and education for Paresh Tripathy."
        path="/experience"
      />
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <Reveal>
            <header className="page-header">
              <h1 className="hero__title">
                <span className="hero__name">Experience</span>
              </h1>
              <p className="section__lede">{data.profile.summary}</p>
            </header>
          </Reveal>
          <ExperienceTimeline
            roles={data.experience.roles}
            education={data.experience.education}
            showEducation
            showHeading={false}
          />
          <SkillGroup groups={data.skills.groups} />
        </Column>
      </Grid>
    </>
  )
}
