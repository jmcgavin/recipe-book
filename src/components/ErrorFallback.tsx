const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ padding: '20px', color: 'red' }}>
    <h2>Error</h2>
    <p>{error.message}</p>
  </div>
)

export default ErrorFallback
