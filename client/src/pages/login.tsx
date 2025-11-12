import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Briefcase, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const { session, loading, signInWithGoogle, isConfigured } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      window.location.href = '/';
    }
  }, [session]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-chart-1/5 to-chart-3/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-chart-1/5 to-chart-3/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-primary/20">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center mx-auto shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-3 bg-clip-text text-transparent">
              WorkForce Analytics Pro
            </h1>
            <p className="text-sm text-muted-foreground">
              Track productivity and manage payroll with ease
            </p>
          </div>

          <div className="bg-muted/30 border border-primary/10 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Secure Login</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in with your Google account to get started. Your data is securely stored in the cloud.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Secure cloud storage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Never lose your data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Access from anywhere
              </li>
            </ul>
          </div>

          {!isConfigured && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2">Configuration Required</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Supabase environment variables are not configured. Please check GOOGLE_OAUTH_SETUP.md for setup instructions.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn || !isConfigured}
            size="lg"
            className="w-full shadow-md hover:shadow-lg transition-all"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign in with Google
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
