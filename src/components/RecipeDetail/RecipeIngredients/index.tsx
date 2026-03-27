import { Marked, type Token } from 'marked'

import styles from './styles.module.scss'

type Props = {
  tokens: Token[]
}

/**
 * Styles the text by applying specific formatting rules:
 * - Text within parentheses is wrapped in a span with a specific class for styling.
 * - Text within double square brackets is converted into a link format.
 */
const styleText = (text: string): string => {
  let styledText = text
  styledText = styledText.replace(/\(([^)]*)\)/g, `<span class="${styles.parentheses}">($1)</span>`)
  styledText = styledText.replace(/\[\[([^\]]+)\]\]/g, `<a href="/$1" target="_blank">[[\$1]]</a>`)
  return styledText
}

// Create a marked instance just for this component
const marked = new Marked({
  renderer: {
    text(token) {
      return styleText(token.text)
    },
  },
})

export const RecipeIngredients = ({ tokens }: Props) => {
  // console.log('Ingredients tokens', tokens)
  const html = marked.parser(tokens)

  return <section className={styles.container} dangerouslySetInnerHTML={{ __html: html }} />
}
