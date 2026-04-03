import { Marked, type Token } from 'marked'

type Props = {
  tokens: Token[]
}

/**
 * Formats the text by converting http/https links into anchor tags.
 */
const formatText = (text: string): string => {
  let styledText = text
  styledText = styledText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
  return styledText
}

export const RecipeReferences = ({ tokens }: Props) => {
  const marked = new Marked({
    renderer: {
      text(token) {
        return formatText(token.text)
      },
    },
  })

  // console.log('References tokens', tokens)
  const html = marked.parser(tokens)

  return <section dangerouslySetInnerHTML={{ __html: html }} />
}
