import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

const root = document.getElementById('root')!

// Dev helper: reset anonymous device token + daily lock via URL param.
// Visit: http://localhost:5173/?resetDevice=1
try {
  const url = new URL(window.location.href)
  if (url.searchParams.get('resetDevice') === '1') {
    localStorage.removeItem('uwoguessr_device_token_v1')
    localStorage.removeItem('uwoguessr_daily_completed_date')
    url.searchParams.delete('resetDevice')
    window.location.replace(url.toString())
  }
} catch {
  // ignore
}

import('./App')
  .then(({ default: App }) => {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
  })
  .catch((err) => {
    const msg = err?.message || String(err)
    root.innerHTML =
      '<div style="padding:2rem;font-family:system-ui;max-width:520px;margin:2rem auto;line-height:1.5">' +
      '<h2 style="color:#7c3aed">UwoGuessr failed to load</h2>' +
      '<pre style="background:#fef2f2;color:#991b1b;padding:1rem;border-radius:8px;overflow:auto;font-size:14px">' +
      msg.replace(/</g, '&lt;') +
      '</pre>' +
      '<p style="color:#64748b">Check the browser Console (F12) for more. If it says "Missing Supabase", add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and redeploy.</p>' +
      '</div>'
  })
