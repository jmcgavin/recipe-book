import { Link } from 'react-router-dom'

import styles from './styles.module.css'

const ErrorFallback = ({ error }: { error: unknown }) => {
  const message = error instanceof Error ? error.message : 'An unknown error occurred.'

  return (
    <div className={styles.container}>
      <h2>Error</h2>
      <p>{message}</p>
      <Link to='/'>Return to Recipe List</Link>
    </div>
  )
}

export default ErrorFallback
