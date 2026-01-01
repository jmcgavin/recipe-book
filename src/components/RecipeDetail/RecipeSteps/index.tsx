import { type Token, marked } from 'marked'

import styles from './styles.module.css'

type Props = {
  tokens: Token[]
}

const RecipeSteps = ({ tokens }: Props) => {
  // console.log('Steps tokens', tokens)
  const html = marked.parser(tokens)

  return (
    <section className={styles.section} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default RecipeSteps
