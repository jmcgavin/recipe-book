import { TextInput } from '@mantine/core'
import { Search } from 'lucide-react'
import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'
import { TagSelector } from './TagSelector'
import { RecipeFileMeta } from '../../types'
import { extractRecipeInfoData, tokensToSections } from '../../utils/marked'
import { ErrorFallback } from '../ErrorFallback'
import { Spinner } from '../Spinner'

const cookbookIcon = '/cookbook.svg'

const RecipeList = () => {
  const [allTags, setAllTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allRecipeData, setAllRecipeData] = useState<RecipeFileMeta[]>([])
  const [filteredRecipeData, setFilteredRecipeData] = useState<RecipeFileMeta[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

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
            fileMeta.push({
              id,
              title,
              tags,
            })
          }
        }

        setAllRecipeData(fileMeta)
        setAllTags([...new Set(fileMeta.flatMap((meta) => meta.tags))].sort())
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load recipes'))
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadRecipes()
  }, [])

  useEffect(() => {
    let filtered = allRecipeData

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((recipe) => selectedTags.every((tag) => recipe.tags.includes(tag)))
    }

    setFilteredRecipeData(filtered)
  }, [allRecipeData, searchQuery, selectedTags])

  if (error) return <ErrorFallback error={error} />

  return (
    <>
      <h1 className={styles.header}>
        <img src={cookbookIcon} alt='Cookbook' /> Jordan&apos;s Recipes
      </h1>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      ) : (
        <>
          <div className={styles.filters}>
            <TextInput
              leftSection={<Search />}
              label='Search recipes by name'
              placeholder='Enter recipe name'
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            <TagSelector data={allTags} onChange={setSelectedTags} />
          </div>
          <ul>
            {filteredRecipeData.length ? (
              filteredRecipeData.map(({ id, title }) => (
                <li key={id}>
                  <Link to={`/${id}`}>
                    <strong>{title}</strong>
                  </Link>
                </li>
              ))
            ) : (
              <p>No recipes found</p>
            )}
          </ul>
        </>
      )}
    </>
  )
}

export default RecipeList
