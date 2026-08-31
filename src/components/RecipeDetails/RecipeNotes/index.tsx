import { type Token, marked } from 'marked'
import { useMemo } from 'react'

type Props = {
  tokens: Token[]
}

export const RecipeNotes = ({ tokens }: Props) => {
  // console.log('Notes tokens', tokens)
  const html = useMemo(() => marked.parser(tokens), [tokens])

  return <section dangerouslySetInnerHTML={{ __html: html }} />
}
