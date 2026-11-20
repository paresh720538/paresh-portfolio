import { useMemo, useRef, useState } from 'react'
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

type Props = {
  /** When false, connectors stay undrawn so animation can sync with hero boot. */
  active?: boolean
}

const VB_W = 420
const VB_H = 280

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

function center(node: NodeDef) {
  const w = node.core ? 56 : 72
  const h = node.core ? 56 : 44
  return { x: node.x + w / 2, y: node.y + h / 2 }
}

function edgePath(from: NodeDef, to: NodeDef) {
  const a = center(from)
  const b = center(to)
  return { a, b, d: `M ${a.x} ${a.y} L ${b.x} ${b.y}` }
}

export function SystemsMapVisual({ active = true }: Props) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const play = active && !reduced

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
      edges
        .filter((_, i) => i % 2 === 0)
        .map((edge, i) => ({
          key: `packet-${edge.key}`,
          d: edge.d,
          delay: 0.35 + i * 0.35,
          duration: 2.1 + (i % 3) * 0.25,
        })),
    [edges],
  )

  const onMove = (e: { clientX: number; clientY: number }) => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setOffset({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
    })
  }

  return (
    <div
      ref={ref}
      className={`systems-map${play ? ' systems-map--animate' : ''}`}
      aria-hidden="true"
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <svg className="systems-map__svg" viewBox={`0 0 ${VB_W} ${VB_H}`} role="presentation">
        {/* Static faint rails so topology is readable even before draw */}
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
                : reduced
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
                {/* opacity=0 until SMIL begins — avoids flash at SVG origin (0,0) */}
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
          return (
            <motion.div
              key={node.id}
              className={`systems-map__chip${node.core ? ' systems-map__chip--core' : ''}`}
              style={{
                left: `${(node.x / VB_W) * 100}%`,
                top: `${(node.y / VB_H) * 100}%`,
                transform: node.core
                  ? `translate(${offset.x}px, ${offset.y}px)`
                  : undefined,
              }}
              initial={false}
              animate={
                play || reduced
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: node.core ? 0 : 14, scale: node.core ? 0.94 : 1 }
              }
              transition={
                play
                  ? {
                      ...easeOut,
                      duration: node.core ? 0.4 : 0.5,
                      delay: 0.2 + index * 0.05,
                    }
                  : { duration: 0 }
              }
            >
              {node.core ? (
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
