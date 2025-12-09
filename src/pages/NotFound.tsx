import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
      
      <div className="relative text-center">
        <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild variant="glow" size="lg">
          <a href="/login">
            <Home className="w-5 h-5 mr-2" />
            Back to Login
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
