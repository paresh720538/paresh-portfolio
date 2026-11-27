import { useId } from 'react'

type Props = {
  /** Show wordmark beside the mark */
  withWordmark?: boolean
  wordmark?: string
  className?: string
  size?: number
}

/** Premium PT monogram — Carbon g100 / systems-map visual language. */
export function BrandLogo({
  withWordmark = false,
  wordmark = 'Paresh Tripathy',
  className = '',
  size = 28,
}: Props) {
  const uid = useId().replace(/:/g, '')

  return (
    <span className={`brand-logo${className ? ` ${className}` : ''}`}>
      <svg
        className="brand-logo__mark"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${uid}-ring`} x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A6C8FF" />
            <stop offset="50%" stopColor="#78A9FF" />
            <stop offset="100%" stopColor="#0F62FE" />
          </linearGradient>
          <linearGradient id={`${uid}-glyph`} x1="20" y1="16" x2="46" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A6C8FF" />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#78A9FF" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#78A9FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill={`url(#${uid}-glow)`} />
        <circle cx="32" cy="32" r="28" stroke={`url(#${uid}-ring)`} strokeWidth="1.4" />
        <circle cx="32" cy="32" r="24" stroke="#78A9FF" strokeWidth="0.7" opacity="0.25" />
        <circle cx="32" cy="32" r="21.5" fill="#121212" />
        {/* P */}
        <path
          fill={`url(#${uid}-glyph)`}
          fillRule="evenodd"
          d="M20.5 18.5h10.4c5.45 0 8.9 2.9 8.9 7.55s-3.45 7.55-8.9 7.55H24.7V45.5h-4.2V18.5Zm4.2 3.65v7.8h6c2.9 0 4.65-1.45 4.65-3.9s-1.75-3.9-4.65-3.9h-6Z"
        />
        {/* T — locked to the P bowl */}
        <path
          fill={`url(#${uid}-glyph)`}
          d="M36.2 18.5H48.5v3.7H42.2V45.5h-4.2V22.2h-1.8V18.5Z"
        />
        {/* Systems accent */}
        <circle cx="45.5" cy="20" r="1.35" fill="#78A9FF" />
        <circle cx="48.8" cy="23.6" r="0.95" fill="#4589FF" />
        <path
          d="M45.5 20 48.8 23.6"
          stroke="#78A9FF"
          strokeWidth="0.85"
          opacity="0.55"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark ? <span className="brand-logo__wordmark">{wordmark}</span> : null}
    </span>
  )
}
