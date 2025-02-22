import {beforeEach, describe, expect, it, jest} from '@jest/globals'
import {renderHook} from '@testing-library/react'

import {TasksEnabledProvider} from './TasksEnabledProvider'
import {useTasksEnabled} from './useTasksEnabled'

jest.mock('../../../hooks', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual: typeof import('../../../hooks') = jest.requireActual('../../../hooks')
  const mock = jest.fn()

  return new Proxy(actual, {
    get: (target, property: keyof typeof actual) => {
      if (property === 'useFeatureEnabled') return mock
      return target[property]
    },
  })
})

jest.mock('../../../studio', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual: typeof import('../../../studio') = jest.requireActual('../../../studio')
  const mock = jest.fn()

  return new Proxy(actual, {
    get: (target, property: keyof typeof actual) => {
      if (property === 'useWorkspace') return mock
      return target[property]
    },
  })
})

describe('TasksEnabledProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not show tasks if user opt out and the feature is not enabled (any plan)', () => {
    require('../../../hooks').useFeatureEnabled.mockReturnValue({enabled: false, isLoading: false})
    require('../../../studio').useWorkspace.mockReturnValue({tasks: {enabled: false}})

    const value = renderHook(useTasksEnabled, {wrapper: TasksEnabledProvider})

    expect(value.result.current).toEqual({enabled: false, mode: null})
  })
  it('should not show tasks if user opt out and the feature is enabled (any plan)', () => {
    require('../../../hooks').useFeatureEnabled.mockReturnValue({enabled: true, isLoading: false})
    require('../../../studio').useWorkspace.mockReturnValue({tasks: {enabled: false}})

    const value = renderHook(useTasksEnabled, {wrapper: TasksEnabledProvider})

    expect(value.result.current).toEqual({enabled: false, mode: null})
  })

  it('should show default mode if user hasnt opted out and the feature is enabled (growth or above)', () => {
    require('../../../hooks').useFeatureEnabled.mockReturnValue({enabled: true, isLoading: false})
    require('../../../studio').useWorkspace.mockReturnValue({tasks: {enabled: true}})

    const value = renderHook(useTasksEnabled, {wrapper: TasksEnabledProvider})

    expect(value.result.current).toEqual({enabled: true, mode: 'default'})
  })

  it('should show upsell mode if user has not opt out and the feature is not enabled (free plans)', () => {
    require('../../../hooks').useFeatureEnabled.mockReturnValue({enabled: false, isLoading: false})
    require('../../../studio').useWorkspace.mockReturnValue({tasks: {enabled: true}})

    const value = renderHook(useTasksEnabled, {wrapper: TasksEnabledProvider})

    expect(value.result.current).toEqual({enabled: true, mode: 'upsell'})
  })

  it('should not show tasks if it is loading the feature', () => {
    require('../../../hooks').useFeatureEnabled.mockReturnValue({enabled: false, isLoading: true})
    require('../../../studio').useWorkspace.mockReturnValue({tasks: {enabled: true}})

    const value = renderHook(useTasksEnabled, {wrapper: TasksEnabledProvider})

    expect(value.result.current).toEqual({enabled: false, mode: null})
  })

  it('should call "useFeatureEnabled" with "sanityTasks"', () => {
    require('../../../studio').useWorkspace.mockReturnValue({tasks: {enabled: false}})

    const useFeatureEnabled = require('../../../hooks').useFeatureEnabled
    useFeatureEnabled.mockReturnValue({enabled: false, isLoading: false})
    renderHook(useTasksEnabled, {wrapper: TasksEnabledProvider})

    expect(useFeatureEnabled).toHaveBeenCalledWith('sanityTasks')
  })
})
