import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CategoryNav } from "@/components/CategoryNav";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Category from "@/pages/Category";
import Categories from "@/pages/Categories";
import Search from "@/pages/Search";
import Deals from "@/pages/Deals";
import Account from "@/pages/Account";
import OrderSuccess from "@/pages/OrderSuccess";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/category/:name" component={Category} />
      <Route path="/categories" component={Categories} />
      <Route path="/search" component={Search} />
      <Route path="/deals" component={Deals} />
      <Route path="/account" component={Account} />
      <Route path="/order-success" component={OrderSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <CategoryNav />
          <main>
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
