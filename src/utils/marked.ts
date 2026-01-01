import { type Token, type Tokens, type TokensList } from 'marked'

import { RECIPE_SECTIONS } from '../constants'
import type { RecipeSectionTokens } from '../types'

/**
 * @typeguard
 * Check if a token is a list token.
 */
export const isListToken = (token: Token): token is Tokens.List => {
  return token.type === 'list'
}

/**
 * @typeguard
 * Check if a token is a list item token.
 */
export const isListItemToken = (token: Token): token is Tokens.ListItem => {
  return token.type === 'list_item'
}

/**
 * @typeguard
 * Check if a token is a text token.
 */
export const isTextToken = (token: Token): token is Tokens.Text => {
  return token.type === 'text'
}

/**
 * @utility
 * Organize Marked tokens into recipe sections.
 */
export const tokensToSections = (tokens: TokensList): RecipeSectionTokens => {
  let section = ''
  const sectionTokens = tokens.reduce<RecipeSectionTokens>((acc, curr) => {
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
      case RECIPE_SECTIONS.STEPS:
        if (!acc[RECIPE_SECTIONS.STEPS]) acc[RECIPE_SECTIONS.STEPS] = []
        acc[RECIPE_SECTIONS.STEPS]!.push(curr)
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
  }, {
    [RECIPE_SECTIONS.TITLE]: null,
    [RECIPE_SECTIONS.INFO]: null,
    [RECIPE_SECTIONS.INGREDIENTS]: null,
    [RECIPE_SECTIONS.STEPS]: null,
    [RECIPE_SECTIONS.NOTES]: null,
    [RECIPE_SECTIONS.REFERENCES]: null,
  })

  return sectionTokens
}
