import { type Token, marked } from 'marked'
import { useMemo } from 'react'

import styles from './styles.module.css'

type Props = {
  tokens: Token[]
}

const RecipeSteps = ({ tokens }: Props) => {
  // console.log('Steps tokens', tokens)
  const html = useMemo(() => marked.parser(tokens), [tokens])

  return <section className={styles.section} dangerouslySetInnerHTML={{ __html: html }} />
}

export default RecipeSteps
