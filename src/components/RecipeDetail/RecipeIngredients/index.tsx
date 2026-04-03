import { Marked, type Token } from 'marked'

import styles from './styles.module.scss'
import type { RecipeFileMeta } from '../../../types'

type Props = {
  tokens: Token[]
  recipeMap?: Map<string, RecipeFileMeta>
}

/**
 * Formats the text by applying specific formatting rules:
 * - Text within parentheses is wrapped in a span with a specific class for styling.
 * - Text within single square brackets is converted into a link format, with the link text being the recipe's title.
 */
const formatText = (text: string, recipeMap?: Map<string, RecipeFileMeta>): string => {
  let styledText = text
  styledText = styledText.replace(/\(([^)]*)\)/g, `<span class="${styles.parentheses}">($1)</span>`)
  styledText = styledText.replace(/\[([^\]]+)\]/g, (_, recipeId: string) => {
    const recipe = recipeMap?.get(recipeId)
    const title = recipe ? recipe.title : recipeId
    return `<a href="/${recipeId}" target="_blank">${title}</a>`
  })
  return styledText
}

export const RecipeIngredients = ({ tokens, recipeMap }: Props) => {
  const marked = new Marked({
    renderer: {
      text(token) {
        return formatText(token.text, recipeMap)
      },
    },
  })

  // console.log('Ingredients tokens', tokens)
  const html = marked.parser(tokens)

  return <section className={styles.container} dangerouslySetInnerHTML={{ __html: html }} />
}
