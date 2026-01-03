import { type Token } from 'marked'
import { Fragment, useMemo } from 'react'

import styles from './styles.module.css'
import { isListItemToken, isListToken, isTextToken } from '../../../utils/marked'

const extractRecipeInfoData = (tokens: Token[]): Record<string, string[]> => {
  // Get the first list token at root level
  const listToken = tokens.find(isListToken)

  if (!listToken) return {}

  const result: Record<string, string[]> = {}

  listToken.items
    .filter(isListItemToken)
    .forEach((item) => {
      // Extract the label (i.e., "Time", "Makes", "Tags")
      const labelToken = item.tokens[0]
      const labelText = isTextToken(labelToken) ? labelToken.raw.trim() : ''
      
      // Extract nested list items or text
      const nestedList = item.tokens[1]
      let values: string[] = []
      
      if (nestedList && isListToken(nestedList)) {
        values = nestedList.items
          .filter(isListItemToken)
          .map((nestedItem) => nestedItem.text?.trim() || '')
          .filter((v): v is string => Boolean(v))
      }
      
      result[labelText] = values
    })

  return result
}

type Props = {
  tokens: Token[]
}

const RecipeInfo = ({ tokens }: Props) => {
  const recipeInfoData = useMemo(() => extractRecipeInfoData(tokens), [tokens])

  return (
    <section className={styles.container}>
      {Object.entries(recipeInfoData).map(([label, values]) => (
        <Fragment key={label}>
          <p className={styles.bold}>{label}</p>
          <p>{values.join(', ')}</p>
        </Fragment>
      ))}
    </section>
  )
}

export default RecipeInfo
