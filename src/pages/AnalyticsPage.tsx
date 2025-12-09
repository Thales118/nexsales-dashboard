import React, { useState, lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

// Lazy load the heavy chart component
const AnalyticsCharts = lazy(() => import('@/components/AnalyticsCharts'));

const AnalyticsPage: React.FC = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Crash Simulator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            Performance metrics and data visualization
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShouldCrash(true)}
          className="gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Simulate Crash
        </Button>
      </div>

      {/* Charts with Error Boundary */}
      <ErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-card rounded-xl border border-border">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Widget Crashed</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              The analytics component encountered an error. The rest of the application continues to work normally.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px] bg-card rounded-xl border border-border">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            </div>
          }
        >
          <AnalyticsCharts shouldCrash={shouldCrash} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default AnalyticsPage;
