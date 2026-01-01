import { type Token, marked } from 'marked'

type Props = {
  tokens: Token[]
}

const RecipeTitle = ({ tokens }: Props) => {
  // console.log('Title tokens', tokens)
  const html = marked.parser(tokens)

  return (
    <section dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default RecipeTitle
