import { useEffect, useState } from 'react'

import styles from './styles.module.scss'
import { useLoading } from '../../providers/LoadingProvider'

type Props = {
  message?: string
}

/**
 * LoadingIndicator component displays a loading spinner and an optional message when the
 * application is in a loading state. It uses the useLoading hook to determine if the
 * application is currently loading.
 * 
 * If the loading state is true, it will display a spinner and the message. If the loading
 * state is false, it will not render anything.
 */
export const LoadingIndicator = ({ message }: Props) => {
  const { isLoading } = useLoading()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowLoading(true)
    }, 200)

    return () => window.clearTimeout(timeoutId)
  }, [isLoading])

  if (!showLoading) return null

  return (
    <div className={styles.loadingContainer} role='status' aria-label='Loading'>
      <div className={styles.spinnerContainer}>
        <span className={styles.spinner}></span>
        {message || 'Loading'}
      </div>
    </div>
  )
}
