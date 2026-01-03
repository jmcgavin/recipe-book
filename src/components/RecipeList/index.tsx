import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.css'
import { RecipeFileMeta } from '../../types'
import ErrorFallback from '../ErrorFallback'

const cookbookIcon = '/cookbook.svg'

const RecipeList = () => {
  const [headers, setHeaders] = useState<RecipeFileMeta[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRecipeHeaders = async () => {
      try {
        const recipeModules = import.meta.glob<string>(
          '../../recipes/*.md',
          { query: '?raw', import: 'default' }
        )

        if (Object.keys(recipeModules).length === 0) {
          throw new Error('No recipes found')
        }

        const recipeHeaders: RecipeFileMeta[] = []

        for (const [path, importFn] of Object.entries(recipeModules)) {
          const content = await importFn()
          const tokens = marked.lexer(content)

          const h1Token = tokens.find(
            token => token.type === 'heading' && token.depth === 1
          )

          if (h1Token && 'text' in h1Token && typeof h1Token.text === 'string') {
            const recipeId = path.replace(/^.*\/(.+)\.md$/, '$1')
            const recipeTitle = h1Token.text

            if (!recipeId) {
              throw new Error(`Invalid file path: ${path}`)
            } else {
              recipeHeaders.push({
                id: recipeId,
                title: recipeTitle,
              })
            }
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
    <>
      <h1 className={styles.header}><img src={cookbookIcon} alt="Cookbook" /> Jordan&apos;s Recipes</h1>
      <ul>
        {headers.map(({ id, title }) => (
          <li key={id}>
            <Link to={`/${id}`}>
              <strong>{title}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default RecipeList
