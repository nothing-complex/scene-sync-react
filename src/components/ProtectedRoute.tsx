
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - Auth state:', { user: user?.email, loading, hasFallback: !!fallback });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, using fallback:', !!fallback);
    // If fallback is provided, show it instead of redirecting to auth
    if (fallback) {
      return <>{fallback}</>;
    }
    // Only redirect to auth if no fallback is provided
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute - User authenticated, showing children');
  return <>{children}</>;
};

export default ProtectedRoute;
