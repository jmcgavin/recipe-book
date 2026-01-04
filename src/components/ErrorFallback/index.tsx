import { Link } from 'react-router-dom'

import styles from './styles.module.css'

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className={styles.container}>
    <h2>Error</h2>
    <p>{error.message}</p>
    <Link to='/'>Take me home</Link>
  </div>
)

export default ErrorFallback
