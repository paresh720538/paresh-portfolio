import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { useContent } from '../hooks/useContent'

export function Footer() {
  const { site, profile } = useContent()
  return (
    <footer className="site-footer">
      <div className="content-shell site-footer__inner">
        <div className="site-footer__brand">
          <BrandLogo size={36} />
          <div>
            <p className="site-footer__name">{profile.name}</p>
            <p className="site-footer__tag">{profile.title}</p>
          </div>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          {site.navigation.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-footer__social">
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          {profile.github ? (
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
        </div>
        <p className="site-footer__legal">
          © {new Date().getFullYear()} {profile.name}. {site.footerText}
        </p>
      </div>
    </footer>
  )
}
