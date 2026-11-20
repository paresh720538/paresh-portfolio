import { z } from 'zod'

const httpUrl = z.string().url().or(z.literal(''))
const pathOrUrl = z.string().min(1)

export const MetricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  context: z.string().optional(),
})

export const ProfileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  location: z.string().min(1),
  availability: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  linkedin: z.string().url(),
  github: httpUrl,
  /** Optional headshot path/URL. Empty string shows initials avatar. */
  avatarUrl: pathOrUrl.or(z.literal('')),
  resumeUrl: pathOrUrl,
  calendarUrl: httpUrl,
  metrics: z.array(MetricSchema).min(1),
})

export const SkillSchema = z.object({
  name: z.string().min(1),
  context: z.string().optional(),
})

export const SkillGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int(),
  skills: z.array(SkillSchema).min(1),
})

export const SkillsSchema = z.object({
  groups: z.array(SkillGroupSchema).min(1),
})

export const ExperienceRoleSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  start: z.string().min(1),
  end: z.string().nullable(),
  current: z.boolean(),
  summary: z.string().min(1),
  projectIds: z.array(z.string()),
  achievements: z.array(z.string()).min(1),
  techStack: z.array(z.string()).min(1),
})

export const EducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  detail: z.string().optional(),
})

export const ExperienceSchema = z.object({
  roles: z.array(ExperienceRoleSchema).min(1),
  education: z.array(EducationSchema).min(1),
})

export const ArchNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  group: z.string().min(1),
})

export const ArchEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
})

export const ArchitectureSchema = z
  .object({
    nodes: z.array(ArchNodeSchema).min(1),
    edges: z.array(ArchEdgeSchema),
  })
  .superRefine((arch, ctx) => {
    const ids = new Set(arch.nodes.map((n) => n.id))
    if (ids.size !== arch.nodes.length) {
      ctx.addIssue({ code: 'custom', message: 'Architecture node ids must be unique' })
    }
    for (const edge of arch.edges) {
      if (!ids.has(edge.from) || !ids.has(edge.to)) {
        ctx.addIssue({
          code: 'custom',
          message: `Edge ${edge.from}→${edge.to} references missing node`,
        })
      }
    }
  })

export const ProjectMediaSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
})

export const ProjectLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
})

export const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  featured: z.boolean(),
  order: z.number().int(),
  role: z.string().min(1),
  companyId: z.string().min(1),
  timeframe: z.string().min(1),
  summary: z.string().min(1),
  challenge: z.string().min(1),
  responsibilities: z.array(z.string()).min(1),
  solution: z.array(z.string()).min(1),
  outcomes: z.array(MetricSchema),
  tags: z.array(z.string()).min(1),
  techStack: z.array(z.string()).min(1),
  architecture: ArchitectureSchema,
  confidentialityNotes: z.string().min(1),
  links: z.array(ProjectLinkSchema),
  media: z.array(ProjectMediaSchema),
})

export const ProjectsSchema = z
  .object({
    projects: z.array(ProjectSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const slugs = data.projects.map((p) => p.slug)
    if (new Set(slugs).size !== slugs.length) {
      ctx.addIssue({ code: 'custom', message: 'Project slugs must be unique' })
    }
  })

export const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const SiteSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  defaultTitle: z.string().min(1),
  defaultDescription: z.string().min(1),
  navigation: z.array(NavItemSchema).min(1),
  cta: z.object({
    primary: z.string(),
    secondary: z.string(),
    projects: z.string(),
    availability: z.string(),
  }),
  howIEngineer: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1),
  footerText: z.string().min(1),
})

export const ContentBundleSchema = z.object({
  profile: ProfileSchema,
  skills: SkillsSchema,
  experience: ExperienceSchema,
  projects: ProjectsSchema,
  site: SiteSchema,
})

export type Profile = z.infer<typeof ProfileSchema>
export type Skills = z.infer<typeof SkillsSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Projects = z.infer<typeof ProjectsSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Site = z.infer<typeof SiteSchema>
export type ContentBundle = z.infer<typeof ContentBundleSchema>
export type Metric = z.infer<typeof MetricSchema>
