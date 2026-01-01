import { marked } from 'marked'
import { Suspense, useEffect, useState } from 'react'

interface RecipeHeader {
  filename: string
  header: string
}

const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ padding: '20px', color: 'red' }}>
    <h2>Error</h2>
    <p>{error.message}</p>
  </div>
)

const RecipeList = () => {
  const [headers, setHeaders] = useState<RecipeHeader[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRecipeHeaders = async () => {
      try {
        // Import all markdown files from the recipes directory
        const recipeModules = import.meta.glob<string>(
          './recipes/*.md',
          { query: '?raw', import: 'default' }
        )

        const recipeHeaders: RecipeHeader[] = []

        for (const [path, importFn] of Object.entries(recipeModules)) {
          const content = await importFn()
          const tokens = marked.lexer(content)
          
          // Find the first h1 header (# header)
          const headerToken = tokens.find(
            token => token.type === 'heading' && token.depth === 1
          )
          
          if (headerToken && 'text' in headerToken) {
            const filename = path.split('/').pop() || path
            const headerText = typeof headerToken.text === 'string' ? headerToken.text : ''
            recipeHeaders.push({
              filename,
              header: headerText,
            })
          }
        }

        setHeaders(recipeHeaders)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load recipes'))
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadRecipeHeaders()
  }, [])

  if (error) return <ErrorFallback error={error} />

  return (
    <div style={{ padding: '20px' }}>
      <h1>Jordan&apos;s Recipes</h1>
      <ul>
        {headers.map(({ filename, header }) => (
          <li key={filename}>
            <strong>{header}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  return (
    <Suspense fallback={<div style={{ padding: '20px' }}>Loading recipes...</div>}>
      <RecipeList />
    </Suspense>
  )
}

export default App
