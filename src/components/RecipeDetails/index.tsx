import { MoveLeft } from 'lucide-react'
import { marked } from 'marked'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'

import { APP_NAME } from '../../constants'
import { useLoading } from '../../providers/LoadingProvider'
import type { RecipeFileMeta, RecipeSectionTokens } from '../../types'
import { tokensToSections } from '../../utils/marked'
import { ErrorFallback } from '../ErrorFallback'
import { RecipeInfo } from './RecipeInfo'
import { RecipeIngredients } from './RecipeIngredients'
import { RecipeInstructions } from './RecipeInstructions'
import { RecipeNotes } from './RecipeNotes'
import { RecipeReferences } from './RecipeReferences'
import { RecipeTitle } from './RecipeTitle'
import styles from './styles.module.scss'
import { LoadingIndicator } from '../LoadingIndicator'

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [recipeSectionTokens, setRecipeSectionTokens] = useState<RecipeSectionTokens>({
    title: null,
    info: null,
    ingredients: null,
    instructions: null,
    notes: null,
    references: null,
  })
  const [recipeMap, setRecipeMap] = useState<Map<string, RecipeFileMeta>>(new Map())
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const { isLoading, trackLoading } = useLoading()

  if (!id) {
    throw new Error('No recipe id provided')
  }

  useEffect(() => {
    setError(null)

    const loadRecipe = async () => {
      try {
        const recipeModules = import.meta.glob<string>('../../recipes/**/recipe.md', {
          query: '?raw',
          import: 'default',
        })

        // Load all recipe metadata for cross-references
        const metaMap = new Map<string, RecipeFileMeta>()
        for (const [path, importFn] of Object.entries(recipeModules)) {
          const fileId = path.replace(/^.*\/([^/]+)\/[^/]+\.md$/, '$1')
          const markdown = await importFn()
          const tokens = marked.lexer(markdown)
          const sectionTokens = tokensToSections(tokens)

          let title = ''
          const h1Token = sectionTokens.title?.find((token) => token.type === 'heading' && token.depth === 1)
          if (h1Token && 'text' in h1Token && typeof h1Token.text === 'string') {
            title = h1Token.text
          }

          if (title) {
            metaMap.set(fileId, { id: fileId, title, tags: [] })
          }
        }

        setRecipeMap(metaMap)

        const modulePath = `../../recipes/${id}/recipe.md`
        const importFn = recipeModules[modulePath]

        if (!importFn) {
          throw new Error(`Recipe not found: ${id}`)
        }

        const markdown = await importFn()
        const tokens = marked.lexer(markdown)
        const sectionTokens = tokensToSections(tokens)

        setRecipeSectionTokens(sectionTokens)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load recipe'))
      }
    }

    const loadImg = async () => {
      try {
        const imageModules = import.meta.glob<string>('../../recipes/**/img.*', { import: 'default' })

        const extensions = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'webp', 'WEBP']
        let imgUrl: string | null = null

        for (const ext of extensions) {
          const imagePath = `../../recipes/${id}/img.${ext}`
          if (imageModules[imagePath]) {
            const url = await imageModules[imagePath]()
            imgUrl = url
            break
          }
        }

        if (imgUrl) {
          setImage(imgUrl)
        }
      } catch (err) {
        console.error('Failed to load image:', err)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    trackLoading(loadRecipe)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    trackLoading(loadImg)
  }, [id, trackLoading])

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen')
          wakeLockRef.current = lock

          // Handle wake lock release
          lock.addEventListener('release', () => {
            wakeLockRef.current = null
          })
        }
      } catch (err) {
        console.warn('Wake lock request failed:', err)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    requestWakeLock()

    // Cleanup: release wake lock when component unmounts
    return () => {
      if (wakeLockRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        wakeLockRef.current.release()
      }
    }
  }, [])

  if (error) return <ErrorFallback error={error} />

  if (isLoading) {
    return <LoadingIndicator message="Loading recipe..." />
  }

  return (
    <>
      <title>{`${APP_NAME} | ${recipeMap.get(id)?.title}`}</title>
      <div className={styles.container}>
        <Link to='/' className={styles.backToRecipesLink}>
          <MoveLeft size={18} /> Back to Recipe List
        </Link>
        {image && <img className={styles.image} src={image} alt={id} />}
        {recipeSectionTokens.title && <RecipeTitle tokens={recipeSectionTokens.title} />}
        {recipeSectionTokens.info && <RecipeInfo tokens={recipeSectionTokens.info} />}
        <hr className={styles.divider} />
        <div className={styles.ingredientsAndInstructions}>
          {recipeSectionTokens.ingredients && (
            <RecipeIngredients tokens={recipeSectionTokens.ingredients} recipeMap={recipeMap} />
          )}
          {recipeSectionTokens.instructions && <RecipeInstructions tokens={recipeSectionTokens.instructions} />}
        </div>
        {(!!recipeSectionTokens.notes || !!recipeSectionTokens.references) && <hr className={styles.divider} />}
        {recipeSectionTokens.notes && <RecipeNotes tokens={recipeSectionTokens.notes} />}
        {recipeSectionTokens.references && <RecipeReferences tokens={recipeSectionTokens.references} />}
      </div>
    </>
  )
}

export default RecipeDetails
