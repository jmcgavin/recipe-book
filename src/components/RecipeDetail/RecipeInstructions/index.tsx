import { type Token, marked } from 'marked'
import { useMemo } from 'react'

import styles from './styles.module.css'

type Props = {
  tokens: Token[]
}

const RecipeInstructions = ({ tokens }: Props) => {
  // console.log('Instructions tokens', tokens)
  const html = useMemo(() => marked.parser(tokens), [tokens])

  return <section className={styles.section} dangerouslySetInnerHTML={{ __html: html }} />
}

export default RecipeInstructions
