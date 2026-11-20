import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  ArchitectureSchema,
  ExperienceSchema,
  ProfileSchema,
  ProjectSchema,
  ProjectsSchema,
  SiteSchema,
  SkillsSchema,
} from './schemas'

const root = resolve(process.cwd(), 'public/content')

function load(name: string) {
  return JSON.parse(readFileSync(resolve(root, name), 'utf8'))
}

describe('content fixtures', () => {
  it('validates profile.json', () => {
    expect(() => ProfileSchema.parse(load('profile.json'))).not.toThrow()
  })

  it('validates skills.json', () => {
    expect(() => SkillsSchema.parse(load('skills.json'))).not.toThrow()
  })

  it('validates experience.json', () => {
    expect(() => ExperienceSchema.parse(load('experience.json'))).not.toThrow()
  })

  it('validates projects.json with unique slugs', () => {
    const parsed = ProjectsSchema.parse(load('projects.json'))
    const slugs = parsed.projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('validates site.json', () => {
    expect(() => SiteSchema.parse(load('site.json'))).not.toThrow()
  })

  it('rejects duplicate project slugs', () => {
    const data = load('projects.json')
    data.projects.push({ ...data.projects[0], title: 'Dup' })
    expect(() => ProjectsSchema.parse(data)).toThrow()
  })

  it('rejects missing mandatory project fields', () => {
    expect(() =>
      ProjectSchema.parse({
        slug: 'x',
        title: 'X',
      }),
    ).toThrow()
  })

  it('rejects invalid URLs in profile', () => {
    const profile = load('profile.json')
    profile.linkedin = 'not-a-url'
    expect(() => ProfileSchema.parse(profile)).toThrow()
  })

  it('rejects architecture edges that reference missing nodes', () => {
    expect(() =>
      ArchitectureSchema.parse({
        nodes: [{ id: 'a', label: 'A', group: 'g' }],
        edges: [{ from: 'a', to: 'missing' }],
      }),
    ).toThrow()
  })
})
