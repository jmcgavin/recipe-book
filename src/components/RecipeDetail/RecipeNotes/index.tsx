import { type Token, marked } from 'marked'

type Props = {
  tokens: Token[]
}

const RecipeNotes = ({ tokens }: Props) => {
  // console.log('Notes tokens', tokens)
  const html = marked.parser(tokens)

  return (
    <section dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default RecipeNotes
