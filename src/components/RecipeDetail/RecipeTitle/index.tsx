import { type Token, marked } from 'marked'
import { useMemo } from 'react'

type Props = {
  tokens: Token[]
}

const RecipeTitle = ({ tokens }: Props) => {
  // console.log('Title tokens', tokens)
  const html = useMemo(() => marked.parser(tokens), [tokens])

  return (
    <section dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default RecipeTitle
