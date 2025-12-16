import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, fullName);
      toast({
        title: "Account created!",
        description: "Logging you in now...",
      });
      // Small delay to ensure session is set
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Signup Card */}
      <Card className="w-full max-w-md relative z-10 animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-secondary flex items-center justify-center glow-secondary animate-pulse-glow">
            <Dumbbell className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">Create Account</h1>
          <p className="text-muted-foreground mt-2">Start managing your gym today</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 animate-slide-up delay-100">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 animate-slide-up delay-200">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 animate-slide-up delay-300">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-secondary" />
                Password
              </label>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 animate-slide-up delay-400">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-secondary" />
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              variant="secondary" 
              size="lg" 
              className="w-full animate-slide-up"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center animate-fade-in">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
