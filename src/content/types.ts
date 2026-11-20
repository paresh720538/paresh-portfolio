export type {
  ContentBundle,
  Profile,
  Skills,
  Experience,
  Projects,
  Project,
  Site,
  Metric,
} from './schemas'

export type ContentState =
  | { status: 'loading' }
  | { status: 'ready'; data: import('./schemas').ContentBundle }
  | { status: 'error'; message: string }
