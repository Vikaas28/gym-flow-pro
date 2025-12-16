import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float delay-300" />
      </div>

      <div className="text-center relative z-10 animate-scale-in">
        <h1 className="text-8xl font-display font-bold gradient-text mb-4">404</h1>
        <p className="text-2xl font-semibold text-foreground mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button variant="gradient">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
