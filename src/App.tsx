import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GroceryList } from "./components/GroceryList";
import { ShoppingList } from "./components/ShoppingList";
import { WatchList } from "./components/WatchList";
import { ReadList } from "./components/ReadList";
import { LocalList } from "./components/LocalList";
import { RecipeList } from "./components/RecipeList";
import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const AppContent = () => {
    if (!session) {
      return (
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      );
    }

    return (
      <TooltipProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/grocery" replace />} />
            <Route path="/grocery" element={<GroceryList />} />
            <Route path="/shopping" element={<ShoppingList />} />
            <Route path="/watch" element={<WatchList />} />
            <Route path="/read" element={<ReadList />} />
            <Route path="/local" element={<LocalList />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="*" element={<Navigate to="/grocery" replace />} />
          </Routes>
        </Layout>
      </TooltipProvider>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;