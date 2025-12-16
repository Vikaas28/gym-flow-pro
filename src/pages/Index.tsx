import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, Loader2 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay for smooth animation
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float delay-300" />
      </div>

      <div className="text-center relative z-10 animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center glow-primary animate-pulse-glow">
          <Dumbbell className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-display font-bold gradient-text mb-4">GymPro</h1>
        <p className="text-muted-foreground mb-6">Management System</p>
        <Loader2 className="w-6 h-6 mx-auto text-primary animate-spin" />
      </div>
    </div>
  );
};

export default Index;
