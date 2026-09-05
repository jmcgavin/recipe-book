import { MantineColorsTuple, MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './app.scss'
import { ErrorFallback } from './components/ErrorFallback'
import { GlobalLoadingIndicator } from './components/GlobalLoadingIndicator'
import RecipeDetails from './components/RecipeDetails'
import RecipeList from './components/RecipeList'
import { LoadingProvider } from './providers/LoadingProvider'

const blue: MantineColorsTuple = [
  '#ecefff',
  '#d5dafb',
  '#a9b1f1',
  '#7a87e9',
  '#5362e1',
  '#3a4bdd',
  '#2c40dc',
  '#1f32c4',
  '#182cb0',
  '#0a259c',
]

const theme = createTheme({
  colors: { blue },
  primaryShade: 3,
  black: '#242424',
  scale: 1.1,
  fontFamily: 'Fira Sans, sans-serif',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LoadingProvider>
          <Analytics />
          <BrowserRouter>
            <GlobalLoadingIndicator />
            <Routes>
              <Route path='/' element={<RecipeList />} />
              <Route path='/:id' element={<RecipeDetails />} />
            </Routes>
          </BrowserRouter>
        </LoadingProvider>
      </ErrorBoundary>
    </MantineProvider>
  </StrictMode>,
)
