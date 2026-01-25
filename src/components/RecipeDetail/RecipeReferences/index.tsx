import { type Token, marked } from 'marked'
import { useMemo } from 'react'

type Props = {
  tokens: Token[]
}

export const RecipeReferences = ({ tokens }: Props) => {
  // console.log('References tokens', tokens)
  const html = useMemo(() => marked.parser(tokens), [tokens])

  return <section dangerouslySetInnerHTML={{ __html: html }} />
}
