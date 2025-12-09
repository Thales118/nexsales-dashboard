import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy loading các trang
const LabExercisesPage = lazy(() => import("./pages/LabExercisesPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              
              {/* Route Inventory dùng Suspense */}
              <Route 
                path="inventory" 
                element={
                  <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Inventory Data...</div>}>
                    <InventoryPage />
                  </Suspense>
                } 
              />

              {/* Route Analytics dùng ErrorBoundary + Suspense */}
              <Route 
                path="analytics" 
                element={
                  <ErrorBoundary fallback={<div className="p-4 m-4 border border-destructive/50 text-destructive rounded bg-destructive/10">Analytics Module Error. Please try refreshing.</div>}>
                    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Charts...</div>}>
                      <AnalyticsPage />
                    </Suspense>
                  </ErrorBoundary>
                } 
              />

              {/* Route Lab Exercises (MỚI THÊM) */}
              <Route 
                path="lab" 
                element={
                  <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Lab Exercises...</div>}>
                    <LabExercisesPage />
                  </Suspense>
                } 
              />

            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;