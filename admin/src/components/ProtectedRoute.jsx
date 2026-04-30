import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-slate-500">
        Loading…
      </div>
    );
  }
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}
