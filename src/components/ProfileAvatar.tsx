type Props = {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'PT'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase()
}

export function ProfileAvatar({ name, src = '', size = 'md', className = '' }: Props) {
  const initials = initialsFromName(name)
  const classes = `profile-avatar profile-avatar--${size}${className ? ` ${className}` : ''}`

  if (src) {
    const px = size === 'lg' ? 96 : size === 'sm' ? 40 : 64
    return (
      <img
        className={classes}
        src={size === 'sm' ? '/avatar-sm.jpg' : src}
        alt={`${name} portrait`}
        width={px}
        height={px}
        loading={size === 'lg' ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <div className={classes} aria-hidden="true" title={name}>
      <span className="profile-avatar__initials">{initials}</span>
    </div>
  )
}
