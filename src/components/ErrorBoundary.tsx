import React from 'react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  message?: string
  stack?: string
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(err: unknown): State {
    const e = err instanceof Error ? err : new Error(String(err))
    return { hasError: true, message: e.message, stack: e.stack }
  }

  componentDidCatch(err: unknown) {
    // Still log to console for full context
    console.error('React render error:', err)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 720, margin: '2rem auto', lineHeight: 1.5 }}>
        <h2 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>UwoGuessr crashed</h2>
        <p style={{ color: '#475569', marginTop: 0 }}>
          This screen shows the exact error so we can fix it.
        </p>
        <pre style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: 8, overflow: 'auto', fontSize: 13 }}>
          {this.state.message || 'Unknown error'}
          {'\n'}
          {this.state.stack || ''}
        </pre>
        <p style={{ color: '#475569' }}>
          After you send me this error text, refresh the page.
        </p>
      </div>
    )
  }
}

