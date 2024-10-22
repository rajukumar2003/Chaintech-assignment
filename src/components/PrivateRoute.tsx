import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute({ children }:any) {
  const { user, loading } = useAuth();

  if (loading) {
      return (
          <div
              className="text-center text-2xl font-bold text-gray-800 mt-4">
              Loading...
          </div>
      ) 
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
