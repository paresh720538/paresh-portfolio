import { Tag } from '@carbon/react'
import type { Skills } from '../content/types'

type Props = {
  groups: Skills['groups']
}

export function SkillGroup({ groups }: Props) {
  const ordered = [...groups].sort((a, b) => a.order - b.order)
  return (
    <section className="section" aria-labelledby="skills-title">
      <h2 id="skills-title" className="section__title section__title--rule">
        Capabilities
      </h2>
      <p className="section__lede">
        Grouped by how I ship systems: backend platforms, cloud delivery, AI pipelines, and product
        clients.
      </p>
      <div className="skill-grid">
        {ordered.map((group) => (
          <article key={group.id} className="surface-tile">
            <h3>{group.title}</h3>
            <div className="tag-row">
              {group.skills.map((skill) => (
                <Tag key={skill.name} type="cool-gray" title={skill.context}>
                  {skill.name}
                </Tag>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
