import { motion } from 'framer-motion'
import type { Project } from '../content/types'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { drawLine, fadeUp, staggerChildren } from '../motion/presets'

type Props = {
  architecture: Project['architecture']
  title?: string
}

type LaidOut = Project['architecture']['nodes'][number] & { x: number; y: number }

const GROUP_ORDER = ['client', 'edge', 'backend', 'data', 'ml', 'security', 'platform']

function layoutByGroups(
  nodes: Project['architecture']['nodes'],
  width = 720,
  height = 360,
): LaidOut[] {
  const present = [
    ...GROUP_ORDER.filter((g) => nodes.some((n) => n.group === g)),
    ...Array.from(new Set(nodes.map((n) => n.group))).filter((g) => !GROUP_ORDER.includes(g)),
  ]
  const rows = Math.max(present.length, 1)
  const yGap = height / (rows + 1)

  return nodes.map((node) => {
    const row = Math.max(0, present.indexOf(node.group))
    const siblings = nodes.filter((n) => n.group === node.group)
    const col = siblings.findIndex((n) => n.id === node.id)
    const xGap = width / (siblings.length + 1)
    return {
      ...node,
      x: xGap * (col + 1),
      y: yGap * (row + 1),
    }
  })
}

export function ArchitectureDiagram({ architecture, title = 'Architecture' }: Props) {
  const reduced = usePrefersReducedMotion()
  const positions = layoutByGroups(architecture.nodes)
  const byId = Object.fromEntries(positions.map((node) => [node.id, node]))
  const vbW = 720
  const vbH = 380

  return (
    <section className="arch-diagram" aria-labelledby="arch-title">
      <h2 id="arch-title" className="section__title section__title--rule">
        {title}
      </h2>
      <svg
        className="arch-svg"
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="img"
        aria-label="Architecture diagram"
      >
        {architecture.edges.map((edge, index) => {
          const from = byId[edge.from]
          const to = byId[edge.to]
          if (!from || !to) return null
          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              className="arch-svg__edge"
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              variants={reduced ? undefined : drawLine}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.04 + index * 0.03 }}
            />
          )
        })}
        <motion.g
          variants={reduced ? undefined : staggerChildren}
          initial={reduced ? false : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
        >
          {positions.map((node) => {
            const label = node.label.length > 22 ? `${node.label.slice(0, 20)}…` : node.label
            const boxW = Math.min(148, Math.max(108, label.length * 6.8))
            return (
              <motion.g key={node.id} variants={reduced ? undefined : fadeUp}>
                <rect
                  className="arch-svg__node"
                  x={node.x - boxW / 2}
                  y={node.y - 18}
                  rx={2}
                  width={boxW}
                  height={36}
                />
                <text className="arch-svg__label" x={node.x} y={node.y + 5} textAnchor="middle">
                  {label}
                </text>
              </motion.g>
            )
          })}
        </motion.g>
      </svg>
      <ul className="sr-only">
        {architecture.edges.map((edge) => {
          const from = architecture.nodes.find((n) => n.id === edge.from)?.label ?? edge.from
          const to = architecture.nodes.find((n) => n.id === edge.to)?.label ?? edge.to
          return (
            <li key={`${edge.from}-${edge.to}`}>
              {from} connects to {to}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
