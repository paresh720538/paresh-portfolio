import { useEffect, useState, type MouseEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
} from '@carbon/react'
import { DocumentBlank, Email, LogoGithub } from '@carbon/icons-react'
import { useContent } from '../hooks/useContent'

/** Only hijack plain primary clicks — keep Cmd/Ctrl/Shift/middle-click native. */
function shouldSoftNavigate(e: {
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  button?: number
}) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button !== undefined && e.button !== 0))
}

export function AppHeader() {
  const { site, profile } = useContent()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  return (
    <Header
      aria-label={site.siteName}
      className={`app-header${scrolled ? ' app-header--scrolled' : ''}`}
    >
      <SkipToContent href="#main-content" />
      <HeaderMenuButton
        aria-label={expanded ? 'Close menu' : 'Open menu'}
        onClick={() => setExpanded((v) => !v)}
        isActive={expanded}
      />
      <HeaderName
        prefix=""
        href="/"
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          if (!shouldSoftNavigate(e)) return
          e.preventDefault()
          navigate('/')
        }}
      >
        {profile.name}
      </HeaderName>
      <HeaderNavigation aria-label="Primary">
        {site.navigation.map((item) => (
          <HeaderMenuItem
            key={item.href}
            href={item.href}
            isCurrentPage={
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            }
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (!shouldSoftNavigate(e)) return
              e.preventDefault()
              navigate(item.href)
            }}
          >
            {item.label}
          </HeaderMenuItem>
        ))}
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Email"
          tooltipAlignment="end"
          onClick={() => {
            window.location.href = `mailto:${profile.email}`
          }}
        >
          <Email size={20} />
        </HeaderGlobalAction>
        {profile.github ? (
          <HeaderGlobalAction
            aria-label="GitHub"
            tooltipAlignment="end"
            onClick={() => window.open(profile.github, '_blank', 'noopener,noreferrer')}
          >
            <LogoGithub size={20} />
          </HeaderGlobalAction>
        ) : null}
        <HeaderGlobalAction
          aria-label={site.cta.primary}
          tooltipAlignment="end"
          onClick={() => navigate('/resume')}
        >
          <DocumentBlank size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
      <SideNav
        aria-label="Side navigation"
        expanded={expanded}
        isPersistent={false}
        onOverlayClick={() => setExpanded(false)}
      >
        <SideNavItems>
          {site.navigation.map((item) => (
            <SideNavLink
              key={item.href}
              as={NavLink}
              to={item.href}
              onClick={() => setExpanded(false)}
            >
              {item.label}
            </SideNavLink>
          ))}
          <SideNavLink as={Link} to="/resume" onClick={() => setExpanded(false)}>
            {site.cta.primary}
          </SideNavLink>
        </SideNavItems>
      </SideNav>
    </Header>
  )
}
