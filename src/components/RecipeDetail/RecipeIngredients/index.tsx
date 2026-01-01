import { Marked, type Token } from 'marked'

import styles from './styles.module.css'

type Props = {
  tokens: Token[]
}

// Helper function to wrap parentheses in spans
const wrapParentheses = (text: string): string => {
  return text.replace(/\(([^)]*)\)/g, `<span class="${styles.parentheses}">($1)</span>`)
}

// Create a marked instance just for this component
const marked = new Marked({
  renderer: {
    text(token) {
      return wrapParentheses(token.text)
    }
  }
})

const RecipeIngredients = ({ tokens }: Props) => {
  // console.log('Ingredients tokens', tokens)
  const html = marked.parser(tokens)

  return (
    <section className={styles.container} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default RecipeIngredients
