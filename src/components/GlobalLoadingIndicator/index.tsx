import { useEffect, useState } from 'react'

import styles from './styles.module.scss'
import { useLoading } from '../../providers/LoadingProvider'

export const GlobalLoadingIndicator = () => {
  const { isLoading } = useLoading()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowLoading(true)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [isLoading])

  if (!showLoading) return null

  return (
    <div className={styles.loadingContainer} role='status' aria-label='Loading'>
      <span className={styles.spinner}></span>
    </div>
  )
}
