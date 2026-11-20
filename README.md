# Paresh Tripathy — Portfolio

Recruiter-first React + TypeScript portfolio using IBM Carbon Design System (Gray 100). All copy and case-study data live in version-controlled JSON under `public/content/`.

## Stack

- Vite + React 19 + TypeScript
- `@carbon/react` (g100 theme)
- React Router SPA
- Zod-validated content at startup
- Vercel Web Analytics
- Static `public/resume.pdf`

## Local development

```bash
cd /home/paresh/Desktop/paresh-portfolio
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm test` | Zod schema / content fixture tests |

## Updating content (no React changes)

Edit JSON only:

- `public/content/profile.json` — identity, contact, proof metrics
- `public/content/skills.json` — capability groups
- `public/content/experience.json` — roles + education
- `public/content/projects.json` — case studies (add a project by appending an object with a unique `slug`)
- `public/content/site.json` — nav, CTAs, SEO defaults

Replace `public/resume.pdf` to update the downloadable resume.

Optional fields: `profile.github`, `profile.calendarUrl` (leave `""` until ready).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel (framework: Vite).
3. Production branch: `main`.
4. `vercel.json` already rewrites all routes to `index.html` for deep links.
5. Attach a custom domain and enable Web Analytics in the Vercel project.

Preview deployments are created automatically for pull requests.

## Routes

- `/` — overview
- `/projects` — filterable projects
- `/projects/:slug` — case study
- `/experience` — timeline + skills + education
- `/resume` — PDF view/download
- `*` — 404

## Confidentiality

Do not commit proprietary source, credentials, customer data, or unapproved screenshots. Architecture diagrams are generated from JSON nodes/edges only.
