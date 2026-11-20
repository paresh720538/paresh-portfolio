import { useEffect, useRef, useState } from 'react'
import type { Metric } from '../content/types'
import { MotionItem, Stagger } from '../motion/Motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = {
  metrics: Metric[]
  title?: string
  className?: string
}

function parseMetricValue(value: string): {
  prefix: string
  num: number | null
  suffix: string
  decimals: number
} {
  const match = value.match(/^(.*?)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: '', num: null, suffix: value, decimals: 0 }
  const raw = match[2] ?? '0'
  const decimals = raw.includes('.') ? (raw.split('.')[1]?.length ?? 0) : 0
  return {
    prefix: match[1] ?? '',
    num: Number(raw),
    suffix: match[3] ?? '',
    decimals,
  }
}

function AnimatedValue({ value }: { value: string }) {
  const reduced = usePrefersReducedMotion()
  const { prefix, num, suffix, decimals } = parseMetricValue(value)
  const [display, setDisplay] = useState(reduced || num === null ? value : `${prefix}0${suffix}`)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced || num === null || started.current) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return
        started.current = true
        const duration = 900
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          const current = num * eased
          const formatted =
            decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString()
          setDisplay(`${prefix}${formatted}${suffix}`)
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick)
          } else {
            rafRef.current = null
          }
        }
        rafRef.current = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [decimals, num, prefix, reduced, suffix, value])

  return (
    <div ref={ref} className="metric-card__value">
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </div>
  )
}

export function MetricStrip({
  metrics,
  title = 'Proof points',
  className = 'section',
}: Props) {
  return (
    <section className={className} aria-labelledby="metrics-title">
      <h2 id="metrics-title" className="section__title section__title--rule">
        {title}
      </h2>
      <Stagger className="metric-strip" mode="cards">
        {metrics.map((metric) => (
          <MotionItem
            key={`${metric.label}-${metric.value}`}
            className="metric-card"
            tone="metric"
          >
            <AnimatedValue value={metric.value} />
            <div className="metric-card__label">{metric.label}</div>
            {metric.context ? (
              <div className="metric-card__context">{metric.context}</div>
            ) : null}
          </MotionItem>
        ))}
      </Stagger>
    </section>
  )
}
