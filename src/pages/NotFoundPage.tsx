import { Button, Column, Grid } from '@carbon/react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Seo } from '../components/Seo'
import { SystemsMapVisual } from '../components/SystemsMapVisual'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { fadeUp } from '../motion/presets'

export function NotFoundPage() {
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <Seo
        title="Page not found"
        description="That route is not part of this portfolio."
        path="/404"
        noindex
      />
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          <div className="not-found">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              variants={reduced ? undefined : fadeUp}
            >
              <h1 className="hero__title">
                <span className="hero__name">404</span>
                <span className="hero__role">Signal lost — page not found</span>
              </h1>
              <p className="section__lede">
                That route is not part of this portfolio. Return home or browse projects.
              </p>
              <div className="hero__actions">
                <Button as={Link} to="/">
                  Return home
                </Button>
                <Button kind="tertiary" as={Link} to="/projects">
                  View projects
                </Button>
              </div>
            </motion.div>
            <div className="not-found__visual">
              <SystemsMapVisual />
            </div>
          </div>
        </Column>
      </Grid>
    </>
  )
}
