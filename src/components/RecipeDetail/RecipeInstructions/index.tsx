import { type Token, marked } from 'marked'
import { useMemo } from 'react'

import styles from './styles.module.scss'

type Props = {
  tokens: Token[]
}

export const RecipeInstructions = ({ tokens }: Props) => {
  // console.log('Instructions tokens', tokens)
  const html = useMemo(() => marked.parser(tokens), [tokens])

  return <section className={styles.section} dangerouslySetInnerHTML={{ __html: html }} />
}
