import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GroceryList } from "./components/GroceryList";
import { ShoppingList } from "./components/ShoppingList";
import { WatchList } from "./components/WatchList";
import { ReadList } from "./components/ReadList";
import { LocalList } from "./components/LocalList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/grocery" replace />} />
            <Route path="/grocery" element={<GroceryList />} />
            <Route path="/shopping" element={<ShoppingList />} />
            <Route path="/watch" element={<WatchList />} />
            <Route path="/read" element={<ReadList />} />
            <Route path="/local" element={<LocalList />} />
            {/* Other routes will be added as we implement them */}
            <Route path="*" element={<Navigate to="/grocery" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
