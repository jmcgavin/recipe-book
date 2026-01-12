import { type Token } from 'marked'

import { RECIPE_SECTIONS } from './constants'

export type RecipeSectionTokens = {
  [RECIPE_SECTIONS.TITLE]: Token[] | null
  [RECIPE_SECTIONS.INFO]: Token[] | null
  [RECIPE_SECTIONS.INGREDIENTS]: Token[] | null
  [RECIPE_SECTIONS.INSTRUCTIONS]: Token[] | null
  [RECIPE_SECTIONS.NOTES]: Token[] | null
  [RECIPE_SECTIONS.REFERENCES]: Token[] | null
}

export type RecipeFileMeta = {
  id: string
  title: string
}
