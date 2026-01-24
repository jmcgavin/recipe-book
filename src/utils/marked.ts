import { type Token, type Tokens, type TokensList } from 'marked'

import { RECIPE_SECTIONS } from '../constants'
import type { RecipeSectionTokens } from '../types'

/**
 * Check if a token is a list token.
 * @typeguard
 */
export const isListToken = (token: Token): token is Tokens.List => {
  return token.type === 'list'
}

/**
 * Check if a token is a list item token.
 * @typeguard
 */
export const isListItemToken = (token: Token): token is Tokens.ListItem => {
  return token.type === 'list_item'
}

/**
 * Check if a token is a text token.
 * @typeguard
 */
export const isTextToken = (token: Token): token is Tokens.Text => {
  return token.type === 'text'
}

/**
 * Organize Marked tokens into recipe sections.
 * @utility
 */
export const tokensToSections = (tokens: TokensList): RecipeSectionTokens => {
  let section = ''
  const sectionTokens = tokens.reduce<RecipeSectionTokens>(
    (acc, curr) => {
      // Skip space tokens
      if (curr.type === 'space') {
        return acc
      }

      // Determine current section based on headings
      if (curr.type === 'heading' && typeof curr.text === 'string') {
        if (curr.depth === 1) {
          section = RECIPE_SECTIONS.TITLE
        } else {
          section = curr.text.toLowerCase()
        }
      }

      switch (section) {
        case RECIPE_SECTIONS.TITLE:
          if (!acc[RECIPE_SECTIONS.TITLE]) acc[RECIPE_SECTIONS.TITLE] = []
          acc[RECIPE_SECTIONS.TITLE]!.push(curr)
          break
        case RECIPE_SECTIONS.INFO:
          if (!acc[RECIPE_SECTIONS.INFO]) acc[RECIPE_SECTIONS.INFO] = []
          acc[RECIPE_SECTIONS.INFO]!.push(curr)
          break
        case RECIPE_SECTIONS.INGREDIENTS:
          if (!acc[RECIPE_SECTIONS.INGREDIENTS]) acc[RECIPE_SECTIONS.INGREDIENTS] = []
          acc[RECIPE_SECTIONS.INGREDIENTS]!.push(curr)
          break
        case RECIPE_SECTIONS.INSTRUCTIONS:
          if (!acc[RECIPE_SECTIONS.INSTRUCTIONS]) acc[RECIPE_SECTIONS.INSTRUCTIONS] = []
          acc[RECIPE_SECTIONS.INSTRUCTIONS]!.push(curr)
          break
        case RECIPE_SECTIONS.NOTES:
          if (!acc[RECIPE_SECTIONS.NOTES]) acc[RECIPE_SECTIONS.NOTES] = []
          acc[RECIPE_SECTIONS.NOTES]!.push(curr)
          break
        case RECIPE_SECTIONS.REFERENCES:
          if (!acc[RECIPE_SECTIONS.REFERENCES]) acc[RECIPE_SECTIONS.REFERENCES] = []
          acc[RECIPE_SECTIONS.REFERENCES]!.push(curr)
          break
      }

      return acc
    },
    {
      [RECIPE_SECTIONS.TITLE]: null,
      [RECIPE_SECTIONS.INFO]: null,
      [RECIPE_SECTIONS.INGREDIENTS]: null,
      [RECIPE_SECTIONS.INSTRUCTIONS]: null,
      [RECIPE_SECTIONS.NOTES]: null,
      [RECIPE_SECTIONS.REFERENCES]: null,
    },
  )

  return sectionTokens
}

/**
 * Extract recipe info data from into section tokens.
 * @utility
 */
export const extractRecipeInfoData = (infoSectionTokens: Token[]): Record<string, string[]> => {
  // Get the first list token at root level
  const listToken = infoSectionTokens.find(isListToken)

  if (!listToken) return {}

  const result: Record<string, string[]> = {}

  listToken.items.filter(isListItemToken).forEach((item) => {
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
