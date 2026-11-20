import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { ProfileAvatar } from './ProfileAvatar'

export function Footer() {
  const { site, profile } = useContent()
  return (
    <footer className="site-footer">
      <div className="content-shell site-footer__inner">
        <div className="site-footer__brand">
          <ProfileAvatar name={profile.name} src={profile.avatarUrl} size="sm" />
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
          <Link to="/resume">{site.cta.primary}</Link>
        </div>
        <p className="site-footer__legal">
          © {new Date().getFullYear()} {profile.name}. {site.footerText}
        </p>
      </div>
    </footer>
  )
}
