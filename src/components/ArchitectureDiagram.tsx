import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Project } from '../content/types'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { easeOut } from '../motion/presets'

type Props = {
  architecture: Project['architecture']
  title?: string
}

type ArchNode = Project['architecture']['nodes'][number]

type LaidOut = ArchNode & {
  x: number
  y: number
  w: number
  h: number
  laneIndex: number
}

type Lane = {
  group: string
  label: string
  y: number
  height: number
}

const GROUP_ORDER = ['client', 'edge', 'backend', 'data', 'ml', 'security', 'platform']

const GROUP_LABELS: Record<string, string> = {
  client: 'Client',
  edge: 'Edge',
  backend: 'Backend',
  data: 'Data',
  ml: 'ML / GPU',
  security: 'Security',
  platform: 'Platform',
}

const GROUP_ACCENT: Record<string, string> = {
  client: '#78a9ff',
  edge: '#be95ff',
  backend: '#42be65',
  data: '#f1c21b',
  ml: '#ff832b',
  security: '#fa4d56',
  platform: '#a8a8a8',
}

const LANE_LABEL_W = 88
const PAD_X = 24
const PAD_Y = 20
const NODE_H = 40
const NODE_GAP_X = 16
const LANE_GAP = 12
const LANE_PAD_Y = 18
const VB_W = 860

function nodeWidth(label: string) {
  return Math.min(168, Math.max(112, Math.round(label.length * 7.2 + 28)))
}

function wrapLabel(label: string, maxChars = 18): string[] {
  if (label.length <= maxChars) return [label]
  const parts = label.split(/[\s/]+/)
  if (parts.length === 1) return [label.slice(0, maxChars - 1) + '…']
  const lines: string[] = []
  let cur = ''
  for (const part of parts) {
    const next = cur ? `${cur} ${part}` : part
    if (next.length > maxChars && cur) {
      lines.push(cur)
      cur = part
    } else {
      cur = next
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 2).map((l, i, arr) => (i === arr.length - 1 && label.length > 36 ? `${l.slice(0, maxChars - 1)}…` : l))
}

function layoutSwimlanes(nodes: ArchNode[]): { lanes: Lane[]; placed: LaidOut[]; height: number } {
  const present = [
    ...GROUP_ORDER.filter((g) => nodes.some((n) => n.group === g)),
    ...Array.from(new Set(nodes.map((n) => n.group))).filter((g) => !GROUP_ORDER.includes(g)),
  ]

  const usableW = VB_W - LANE_LABEL_W - PAD_X * 2
  const lanes: Lane[] = []
  const placed: LaidOut[] = []
  let yCursor = PAD_Y

  present.forEach((group, laneIndex) => {
    const siblings = nodes.filter((n) => n.group === group)
    const laneHeight = NODE_H + LANE_PAD_Y * 2
    lanes.push({
      group,
      label: GROUP_LABELS[group] ?? group,
      y: yCursor,
      height: laneHeight,
    })

    const widths = siblings.map((n) => nodeWidth(n.label))
    const totalW = widths.reduce((a, b) => a + b, 0) + NODE_GAP_X * Math.max(0, siblings.length - 1)
    let xCursor = LANE_LABEL_W + PAD_X + Math.max(0, (usableW - totalW) / 2)

    siblings.forEach((node, i) => {
      const w = widths[i]!
      placed.push({
        ...node,
        x: xCursor,
        y: yCursor + LANE_PAD_Y,
        w,
        h: NODE_H,
        laneIndex,
      })
      xCursor += w + NODE_GAP_X
    })

    yCursor += laneHeight + LANE_GAP
  })

  return { lanes, placed, height: yCursor + PAD_Y - LANE_GAP }
}

function boxCenter(n: LaidOut) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 }
}

function attachPoint(from: LaidOut, to: LaidOut): { x: number; y: number; side: 'top' | 'bottom' | 'left' | 'right' } {
  const a = boxCenter(from)
  const b = boxCenter(to)
  const dx = b.x - a.x
  const dy = b.y - a.y

  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy >= 0) return { x: a.x, y: from.y + from.h, side: 'bottom' }
    return { x: a.x, y: from.y, side: 'top' }
  }
  if (dx >= 0) return { x: from.x + from.w, y: a.y, side: 'right' }
  return { x: from.x, y: a.y, side: 'left' }
}

function elbowPath(from: LaidOut, to: LaidOut): string {
  const a = attachPoint(from, to)
  const b = attachPoint(to, from)
  const midY = (a.y + b.y) / 2
  const midX = (a.x + b.x) / 2

  // Same lane → horizontal-ish elbow
  if (from.laneIndex === to.laneIndex) {
    return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`
  }

  // Vertical-dominant: down/up then across
  if (a.side === 'bottom' || a.side === 'top') {
    return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`
  }

  return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`
}

export function ArchitectureDiagram({ architecture, title = 'Architecture' }: Props) {
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLDivElement>(null)
  const inView = useInView(canvasRef, { once: true, amount: 0.2 })
  const show = reduced || inView
  const { lanes, placed, height } = useMemo(
    () => layoutSwimlanes(architecture.nodes),
    [architecture.nodes],
  )
  const byId = useMemo(() => Object.fromEntries(placed.map((n) => [n.id, n])), [placed])
  const vbH = Math.max(320, height)

  const edges = useMemo(
    () =>
      architecture.edges
        .map((edge) => {
          const from = byId[edge.from]
          const to = byId[edge.to]
          if (!from || !to) return null
          return {
            key: `${edge.from}-${edge.to}`,
            d: elbowPath(from, to),
            accent: GROUP_ACCENT[from.group] ?? '#78a9ff',
          }
        })
        .filter(Boolean) as { key: string; d: string; accent: string }[],
    [architecture.edges, byId],
  )

  return (
    <section className="arch-diagram" aria-labelledby="arch-title">
      <h2 id="arch-title" className="section__title section__title--rule">
        {title}
      </h2>
      <div ref={canvasRef} className="arch-canvas">
        <svg
          className="arch-svg"
          viewBox={`0 0 ${VB_W} ${vbH}`}
          role="img"
          aria-label="Architecture diagram"
        >
          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="arch-svg__arrow" />
            </marker>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" className="arch-svg__grid" />
            </pattern>
          </defs>

          <rect width={VB_W} height={vbH} fill="url(#arch-grid)" opacity="0.45" />

          {lanes.map((lane) => (
            <g key={lane.group} className="arch-svg__lane">
              <rect
                className="arch-svg__lane-band"
                x={LANE_LABEL_W}
                y={lane.y}
                width={VB_W - LANE_LABEL_W - PAD_X}
                height={lane.height}
                rx={8}
              />
              <text
                className="arch-svg__lane-label"
                x={PAD_X / 2 + 4}
                y={lane.y + lane.height / 2 + 4}
              >
                {lane.label}
              </text>
            </g>
          ))}

          {edges.map((edge, index) => (
            <motion.path
              key={edge.key}
              className="arch-svg__edge"
              d={edge.d}
              markerEnd="url(#arch-arrow)"
              style={{ stroke: edge.accent }}
              initial={false}
              animate={
                show
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.55, delay: 0.05 + index * 0.03, ease: [0.22, 1, 0.36, 1] }
              }
            />
          ))}

          {placed.map((node, index) => {
            const lines = wrapLabel(node.label)
            const accent = GROUP_ACCENT[node.group] ?? '#78a9ff'
            return (
              <motion.g
                key={node.id}
                initial={false}
                animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={
                  reduced ? { duration: 0 } : { ...easeOut, delay: 0.08 + index * 0.04 }
                }
              >
                <rect
                  className="arch-svg__node"
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={8}
                  style={{ stroke: accent }}
                />
                <rect
                  x={node.x}
                  y={node.y}
                  width={4}
                  height={node.h}
                  rx={2}
                  fill={accent}
                  opacity={0.95}
                />
                {lines.map((line, i) => (
                  <text
                    key={`${node.id}-${i}`}
                    className="arch-svg__label"
                    x={node.x + node.w / 2 + 2}
                    y={
                      node.y +
                      node.h / 2 +
                      (lines.length === 1 ? 4 : i === 0 ? -2 : 12)
                    }
                    textAnchor="middle"
                  >
                    {line}
                  </text>
                ))}
              </motion.g>
            )
          })}
        </svg>
      </div>
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
