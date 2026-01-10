import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.css'
import TagSelector from './TagSelector'
import { RecipeFileMeta } from '../../types'
import { extractRecipeInfoData, tokensToSections } from '../../utils/marked'
import ErrorFallback from '../ErrorFallback'

const cookbookIcon = '/cookbook.svg'

const RecipeList = () => {
  const [allRecipeTags, setAllRecipeTags] = useState<Set<string>>(new Set())
  const [recipeData, setRecipeData] = useState<RecipeFileMeta[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipeModules = import.meta.glob<string>('../../recipes/*.md', { query: '?raw', import: 'default' })

        if (Object.keys(recipeModules).length === 0) {
          throw new Error('No recipes found')
        }

        const fileMeta: RecipeFileMeta[] = []

        for (const [path, importFn] of Object.entries(recipeModules)) {
          const id = path.replace(/^.*\/(.+)\.md$/, '$1')
          const markdown = await importFn()
          const tokens = marked.lexer(markdown)
          const sectionTokens = tokensToSections(tokens)

          // Get recipe title
          let title = ''
          const h1Token = sectionTokens.title?.find((token) => token.type === 'heading' && token.depth === 1)
          if (h1Token && 'text' in h1Token && typeof h1Token.text === 'string') {
            title = h1Token.text
          }

          // Get recipe tags
          let tags: string[] = []
          if (sectionTokens.info) {
            const recipeInfoData = extractRecipeInfoData(sectionTokens.info)
            tags = recipeInfoData['Tags'] // TODO: investigate why this can be undefined but not caught by TS
          }

          if (title) {
            console.log(title, tags)
            fileMeta.push({
              id,
              title,
              tags
            })
          }
        }

        setRecipeData(fileMeta)
        setAllRecipeTags(new Set(fileMeta.flatMap((meta) => meta.tags)))
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load recipes'))
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadRecipes()
  }, [])

  if (error) return <ErrorFallback error={error} />

  return (
    <>
      <h1 className={styles.header}>
        <img src={cookbookIcon} alt='Cookbook' /> Jordan&apos;s Recipes
      </h1>
      <TagSelector options={Array.from(allRecipeTags)} />
      <ul>
        {recipeData.map(({ id, title }) => (
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
