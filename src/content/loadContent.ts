import {
  ContentBundleSchema,
  ExperienceSchema,
  ProfileSchema,
  ProjectsSchema,
  SiteSchema,
  SkillsSchema,
  type ContentBundle,
} from './schemas'

async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`Failed to load ${path} (${res.status})`)
  }
  return res.json()
}

export async function loadContent(): Promise<ContentBundle> {
  const [profile, skills, experience, projects, site] = await Promise.all([
    fetchJson('/content/profile.json'),
    fetchJson('/content/skills.json'),
    fetchJson('/content/experience.json'),
    fetchJson('/content/projects.json'),
    fetchJson('/content/site.json'),
  ])

  const bundle = {
    profile: ProfileSchema.parse(profile),
    skills: SkillsSchema.parse(skills),
    experience: ExperienceSchema.parse(experience),
    projects: ProjectsSchema.parse(projects),
    site: SiteSchema.parse(site),
  }

  return ContentBundleSchema.parse(bundle)
}

export function getFeaturedProjects(data: ContentBundle) {
  return [...data.projects.projects]
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
}

export function getProjectBySlug(data: ContentBundle, slug: string) {
  return data.projects.projects.find((p) => p.slug === slug)
}

export function getAllTags(data: ContentBundle): string[] {
  const tags = new Set<string>()
  for (const project of data.projects.projects) {
    for (const tag of project.tags) tags.add(tag)
  }
  return [...tags].sort()
}
