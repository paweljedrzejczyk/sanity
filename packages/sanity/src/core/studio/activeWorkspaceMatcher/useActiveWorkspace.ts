import {useContext} from 'react'
import {ActiveWorkspaceMatcherContext} from 'sanity/_singletons'

import {type ActiveWorkspaceMatcherContextValue} from './ActiveWorkspaceMatcherContext'

/** @internal */
export function useActiveWorkspace(): ActiveWorkspaceMatcherContextValue {
  const value = useContext(ActiveWorkspaceMatcherContext)
  if (!value) throw new Error('Could not find `ActiveWorkspaceMatcher` context')
  return value
}
