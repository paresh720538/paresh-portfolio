import { motion, type HTMLMotionProps, type MotionProps, type Transition } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { cardStagger, fadeUp, metricSettle, sectionReveal, staggerChildren } from './presets'

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  once?: boolean
  amount?: number
  className?: string
  tone?: 'section' | 'card' | 'default'
}

function variantTransition(
  variants: typeof fadeUp | typeof sectionReveal | undefined,
): Transition | undefined {
  const visible = variants?.visible
  if (visible && typeof visible === 'object' && 'transition' in visible) {
    return visible.transition as Transition
  }
  return undefined
}

export function Reveal({
  children,
  delay = 0,
  once = true,
  amount = 0.18,
  className,
  tone = 'section',
  ...rest
}: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const variants = tone === 'card' ? fadeUp : tone === 'section' ? sectionReveal : fadeUp

  if (reduced) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ ...variantTransition(variants), delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  once?: boolean
  amount?: number
  className?: string
  mode?: 'default' | 'cards'
}

export function Stagger({
  children,
  once = true,
  amount = 0.12,
  className,
  mode = 'default',
  ...rest
}: StaggerProps) {
  const reduced = usePrefersReducedMotion()
  if (reduced) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={mode === 'cards' ? cardStagger : staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function MotionItem({
  children,
  className,
  tone = 'default',
  ...rest
}: HTMLMotionProps<'div'> & {
  children: ReactNode
  className?: string
  tone?: 'default' | 'metric'
}) {
  const reduced = usePrefersReducedMotion()
  if (reduced) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    )
  }
  return (
    <motion.div
      className={className}
      variants={tone === 'metric' ? metricSettle : fadeUp}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function useMotionSafeProps(props: MotionProps): MotionProps {
  const reduced = usePrefersReducedMotion()
  return reduced ? {} : props
}

export { motion }
