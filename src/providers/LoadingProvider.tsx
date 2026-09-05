import { type ReactNode, createContext, useCallback, useContext, useReducer } from 'react'

import { LoadingAction } from '../types'

type LoadingContextValue = {
  isLoading: boolean
  trackLoading: <T>(operation: () => Promise<T>) => Promise<T>
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined)

const loadingReducer = (activeOperations: number, action: LoadingAction) => {
  if (action.type === 'start') return activeOperations + 1
  return Math.max(0, activeOperations - 1)
}

export const useLoading = () => {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [activeOperations, dispatch] = useReducer(loadingReducer, 0)

  const trackLoading = useCallback(async <T,>(operation: () => Promise<T>) => {
    dispatch({ type: 'start' })

    try {
      return await operation()
    } finally {
      dispatch({ type: 'finish' })
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading: activeOperations > 0, trackLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}
