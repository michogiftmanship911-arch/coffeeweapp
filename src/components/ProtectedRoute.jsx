import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

/**
 * Redirects to /auth (remembering where you were headed) when signed out.
 *
 * The check is made when the route mounts. That way, logging out from inside the
 * dashboard doesn't make the exiting page bounce to /auth mid-animation — the
 * page itself renders nothing once `user` is null.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [allowed] = useState(() => Boolean(useStore.getState().user))
  if (!allowed) return <Navigate to="/auth" replace state={{ from: location.pathname, protectedArea: true }} />
  return children
}
