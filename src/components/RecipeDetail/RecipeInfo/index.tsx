import { Badge } from '@mantine/core'
import { type Token } from 'marked'
import { Fragment, useMemo } from 'react'

import styles from './styles.module.scss'
import { getTagIcon } from '../../../utils/icons'
import { extractRecipeInfoData } from '../../../utils/marked'

type Props = {
  tokens: Token[]
}

export const RecipeInfo = ({ tokens }: Props) => {
  const recipeInfoData = useMemo(() => extractRecipeInfoData(tokens), [tokens])

  return (
    <section className={styles.container}>
      {Object.entries(recipeInfoData).map(([label, values]) => {
        let content
        if (label === 'Macros/serving') {
          content = (
            <div className={styles.tags}>
              {values.map((value) => (
                <Badge color='green' variant='light' key={value} title={value}>
                  {value}
                </Badge>
              ))}
            </div>
          )
        } else if (label === 'Tags') {
          content = (
            <div className={styles.tags}>
              {values.map((value) => (
                <Badge variant='light' key={value} title={value} leftSection={getTagIcon({ tag: value })}>
                  {value}
                </Badge>
              ))}
            </div>
          )
        } else {
          content = <p>{values.join(', ')}</p>
        }

        return (
          <Fragment key={label}>
            <p className={styles.bold}>{label}</p>
            {content}
          </Fragment>
        )
      })}
    </section>
  )
}
