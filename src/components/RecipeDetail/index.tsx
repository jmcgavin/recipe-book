import { marked } from 'marked'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import styles from './styles.module.css'
import type { RecipeSectionTokens } from '../../types'
import { tokensToSections } from '../../utils/marked'
import ErrorFallback from '../ErrorFallback'
import RecipeInfo from './RecipeInfo'
import RecipeIngredients from './RecipeIngredients'
import RecipeNotes from './RecipeNotes'
import RecipeReferences from './RecipeReferences'
import RecipeSteps from './RecipeSteps'
import RecipeTitle from './RecipeTitle'


const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const [recipeSectionTokens, setRecipeSectionTokens] = useState<RecipeSectionTokens>({
    title: null,
    info: null,
    ingredients: null,
    steps: null,
    notes: null,
    references: null,
  })
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        if (!id) {
          throw new Error('No recipe id provided')
        }

        const recipeModules = import.meta.glob<string>(
          '../../recipes/*.md',
          { query: '?raw', import: 'default' }
        )

        const modulePath = `../../recipes/${id}.md`
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
      } finally {
        setLoading(false)
      }
    }

    const loadImg = async () => {
      try {
        const imageModules = import.meta.glob<string>(
          '../../images/*',
          { import: 'default' }
        )

        const extensions = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'webp', 'WEBP', 'svg', 'SVG']
        let imgUrl: string | null = null

        for (const ext of extensions) {
          const imagePath = `../../images/${id}.${ext}`
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
    loadRecipe()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadImg()
  }, [id])

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

  if (loading) return <>Loading...</>
  if (error) return <ErrorFallback error={error} />

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backToRecipesLink}>← Back to Recipes</Link>
      {image && <img className={styles.image} src={image} alt={id} />}
      {recipeSectionTokens.title && <RecipeTitle tokens={recipeSectionTokens.title} />}
      {recipeSectionTokens.info && <RecipeInfo tokens={recipeSectionTokens.info} />}
      <div className={styles.ingredientsAndSteps}>
        {recipeSectionTokens.ingredients && <RecipeIngredients tokens={recipeSectionTokens.ingredients} />}
        {recipeSectionTokens.steps && <RecipeSteps tokens={recipeSectionTokens.steps} />}
      </div>
      {(!!recipeSectionTokens.notes || !!recipeSectionTokens.references) && <hr className={styles.divider} />}
      {recipeSectionTokens.notes && <RecipeNotes tokens={recipeSectionTokens.notes} />}
      {recipeSectionTokens.references && <RecipeReferences tokens={recipeSectionTokens.references} />}
    </div>
  )
}

export default RecipeDetail
