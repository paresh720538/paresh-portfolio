import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Application,
  Chip,
  Cloud,
  DataBase,
  Mobile,
  Network_3,
  Security,
} from '@carbon/icons-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { easeOut } from '../motion/presets'

type NodeDef = {
  id: string
  label: string
  x: number
  y: number
  icon: typeof Application
  core?: boolean
}

type Edge = { from: string; to: string }

type Point = { x: number; y: number }

type Props = {
  /** When false, connectors stay undrawn so animation can sync with hero boot. */
  active?: boolean
}

const VB_W = 420
const VB_H = 280
const CORE_SIZE = 56
const CHIP_W = 72
const CHIP_H = 44

const NODES: NodeDef[] = [
  { id: 'mobile', label: 'Mobile', x: 52, y: 36, icon: Mobile },
  { id: 'api', label: 'API', x: 178, y: 28, icon: Application },
  { id: 'auth', label: 'Auth', x: 310, y: 36, icon: Security },
  { id: 'dapr', label: 'Dapr', x: 88, y: 118, icon: Network_3 },
  { id: 'core', label: 'PT', x: 178, y: 112, icon: Application, core: true },
  { id: 'gpu', label: 'GPU', x: 276, y: 118, icon: Chip },
  { id: 'data', label: 'Data', x: 88, y: 208, icon: DataBase },
  { id: 'cloud', label: 'Cloud', x: 276, y: 208, icon: Cloud },
]

const EDGES: Edge[] = [
  { from: 'mobile', to: 'api' },
  { from: 'api', to: 'auth' },
  { from: 'mobile', to: 'dapr' },
  { from: 'api', to: 'core' },
  { from: 'auth', to: 'gpu' },
  { from: 'auth', to: 'core' },
  { from: 'dapr', to: 'core' },
  { from: 'core', to: 'gpu' },
  { from: 'dapr', to: 'data' },
  { from: 'gpu', to: 'cloud' },
  { from: 'core', to: 'data' },
  { from: 'core', to: 'cloud' },
]

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!
}

function center(node: NodeDef): Point {
  if (node.core) {
    return { x: node.x + CORE_SIZE / 2, y: node.y + CORE_SIZE / 2 }
  }
  return { x: node.x + CHIP_W / 2, y: node.y + CHIP_H / 2 }
}

/** Move a point from `from` toward `to` so it sits on the node border. */
function borderPoint(node: NodeDef, toward: Point): Point {
  const c = center(node)
  const dx = toward.x - c.x
  const dy = toward.y - c.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len

  if (node.core) {
    const r = CORE_SIZE / 2 + 2
    return { x: c.x + ux * r, y: c.y + uy * r }
  }

  // Intersect with chip AABB
  const hw = CHIP_W / 2 + 1
  const hh = CHIP_H / 2 + 1
  const tx = ux === 0 ? Infinity : hw / Math.abs(ux)
  const ty = uy === 0 ? Infinity : hh / Math.abs(uy)
  const t = Math.min(tx, ty)
  return { x: c.x + ux * t, y: c.y + uy * t }
}

function edgePath(from: NodeDef, to: NodeDef) {
  const a = borderPoint(from, center(to))
  const b = borderPoint(to, center(from))
  return { a, b, d: `M ${a.x} ${a.y} L ${b.x} ${b.y}` }
}

export function SystemsMapVisual({ active = true }: Props) {
  const reduced = usePrefersReducedMotion()
  const play = active && !reduced
  // Hub stays readable during boot; only satellites wait for play
  const showNodes = play || reduced || active

  const edges = useMemo(
    () =>
      EDGES.map((edge) => {
        const from = nodeById(edge.from)
        const to = nodeById(edge.to)
        return { key: `${edge.from}-${edge.to}`, ...edgePath(from, to) }
      }),
    [],
  )

  const packets = useMemo(
    () =>
      edges.map((edge, i) => ({
        key: `packet-${edge.key}`,
        d: edge.d,
        // Stagger so every link (API↔Auth, Cloud, etc.) carries motion
        delay: 0.28 + i * 0.22,
        duration: 2.0 + (i % 4) * 0.28,
      })),
    [edges],
  )

  return (
    <div
      className={`systems-map${play ? ' systems-map--animate' : ''}`}
      aria-hidden="true"
    >
      <svg className="systems-map__svg" viewBox={`0 0 ${VB_W} ${VB_H}`} role="presentation">
        {edges.map((edge) => (
          <path key={`rail-${edge.key}`} className="systems-map__rail" d={edge.d} />
        ))}

        {edges.map((edge, index) => (
          <motion.path
            key={edge.key}
            className="systems-map__edge"
            d={edge.d}
            initial={false}
            animate={
              play
                ? { pathLength: 1, opacity: 1 }
                : reduced || active
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
            }
            transition={
              play
                ? {
                    pathLength: {
                      duration: 0.95,
                      delay: 0.12 + index * 0.055,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: { duration: 0.25, delay: 0.12 + index * 0.055 },
                  }
                : { duration: 0 }
            }
          />
        ))}

        {play
          ? packets.map((p) => (
              <g key={p.key} className="systems-map__packet-wrap">
                <circle r="3.5" className="systems-map__packet" opacity="0">
                  <animateMotion
                    path={p.d}
                    dur={`${p.duration}s`}
                    begin={`${p.delay}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                    calcMode="linear"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.08;0.86;1"
                    dur={`${p.duration}s`}
                    begin={`${p.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))
          : null}
      </svg>

      <div className="systems-map__nodes">
        {NODES.map((node, index) => {
          const Icon = node.icon
          const isCore = Boolean(node.core)
          return (
            <motion.div
              key={node.id}
              className={`systems-map__chip${isCore ? ' systems-map__chip--core' : ''}`}
              style={{
                left: `${(node.x / VB_W) * 100}%`,
                top: `${(node.y / VB_H) * 100}%`,
              }}
              initial={false}
              animate={
                isCore || showNodes
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 14, scale: 1 }
              }
              transition={
                play
                  ? {
                      ...easeOut,
                      duration: isCore ? 0.35 : 0.5,
                      delay: isCore ? 0.08 : 0.2 + index * 0.05,
                    }
                  : { duration: 0 }
              }
            >
              {isCore ? (
                <span className="systems-map__core-mark">PT</span>
              ) : (
                <>
                  <Icon size={16} />
                  <span>{node.label}</span>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
