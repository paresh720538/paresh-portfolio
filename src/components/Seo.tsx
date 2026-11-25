import { useEffect } from 'react'
import { useContent } from '../hooks/useContent'

type SeoProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  noindex?: boolean
}

export function Seo({ title, description, path = '/', image, noindex = false }: SeoProps) {
  const { site, profile } = useContent()
  const fullTitle = title ? `${title} — ${site.siteName}` : site.defaultTitle
  const desc = description ?? site.defaultDescription
  const url = `${site.siteUrl}${path === '/' ? '/' : path}`
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${site.siteUrl}${image}`
    : `${site.siteUrl}/og.png`

  useEffect(() => {
    document.title = fullTitle
    setMeta('description', desc)
    setMeta(
      'keywords',
      [
        'Paresh Tripathy',
        'Paresh',
        'Senior Python Developer',
        'Python developer',
        'Django developer',
        'FastAPI',
        'Senior Software Engineer',
        'Noida',
        'India',
      ].join(', '),
    )
    setMeta('author', profile.name)
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', url, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:site_name', site.siteName, true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', ogImage)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setMeta('googlebot', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonical(url)

    const scriptId = 'person-jsonld'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = scriptId
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${site.siteUrl}/#person`,
          name: profile.name,
          alternateName: ['Paresh', 'Paresh Tripathy'],
          jobTitle: profile.title,
          description: profile.summary,
          email: profile.email,
          telephone: profile.phone || undefined,
          url: site.siteUrl,
          image: `${site.siteUrl}${profile.avatarUrl || '/og.png'}`,
          sameAs: [profile.linkedin, profile.github].filter(Boolean),
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
          knowsAbout: [
            'Python',
            'FastAPI',
            'Django',
            'Flask',
            'Microservices',
            'Kubernetes',
            'AWS',
            'GCP',
            'Applied AI',
            'Distributed systems',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${site.siteUrl}/#website`,
          name: site.siteName,
          url: site.siteUrl,
          description: site.defaultDescription,
          publisher: { '@id': `${site.siteUrl}/#person` },
          inLanguage: 'en',
        },
        {
          '@type': 'ProfilePage',
          '@id': `${site.siteUrl}/#profile`,
          url: site.siteUrl,
          name: fullTitle,
          description: desc,
          mainEntity: { '@id': `${site.siteUrl}/#person` },
          isPartOf: { '@id': `${site.siteUrl}/#website` },
        },
      ],
    })
  }, [fullTitle, desc, url, ogImage, noindex, profile, site])

  return null
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}
