import { MantineProvider, createTheme } from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import './app.css'
import ErrorFallback from './components/ErrorFallback'
import Router from './components/Router'

const theme = createTheme({
  black: '#242424',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Analytics />
        <Router />
      </ErrorBoundary>
    </MantineProvider>
  </StrictMode>,
)
