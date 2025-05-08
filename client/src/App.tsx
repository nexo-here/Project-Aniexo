import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import AnimeDetail from "@/pages/AnimeDetail";
import Upcoming from "@/pages/Upcoming";
import Trending from "@/pages/Trending";
import Underrated from "@/pages/Underrated";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Favorites from "@/pages/user/Favorites";
import History from "@/pages/user/History";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/anime/:id" component={AnimeDetail} />
      <Route path="/upcoming" component={Upcoming} />
      <Route path="/trending" component={Trending} />
      <Route path="/underrated" component={Underrated} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
