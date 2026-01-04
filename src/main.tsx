import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorFallback from './components/ErrorFallback'
import Router from './components/Router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Analytics />
      <Router />
    </ErrorBoundary>
  </StrictMode>,
)
