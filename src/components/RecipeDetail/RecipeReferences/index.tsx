import { type Token, marked } from 'marked'

type Props = {
  tokens: Token[]
}

const RecipeReferences = ({ tokens }: Props) => {
  // console.log('References tokens', tokens)
  const html = marked.parser(tokens)

  return (
    <section dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default RecipeReferences
