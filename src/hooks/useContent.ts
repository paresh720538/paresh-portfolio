import { createContext, useContext } from 'react'
import type { ContentBundle, ContentState } from '../content/types'

export const ContentContext = createContext<ContentState>({ status: 'loading' })

export function useContentState() {
  return useContext(ContentContext)
}

export function useContent(): ContentBundle {
  const state = useContentState()
  if (state.status !== 'ready') {
    throw new Error('Content is not ready')
  }
  return state.data
}
