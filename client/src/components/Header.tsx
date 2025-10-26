import { Search, ShoppingCart, User, Heart } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "@shared/schema";
import { getSessionId } from "@/lib/session";

export function Header() {
  const [location, setLocation] = useLocation();
  const sessionId = getSessionId();
  
  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="mx-auto max-w-7xl">
        {/* Top bar with logo and cart */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/">
            <button 
              className="text-xl font-bold text-primary-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md"
              data-testid="link-home"
            >
              FirstCart
            </button>
          </Link>

          {/* Search bar - hidden on very small screens */}
          <div className="relative flex-1 max-w-xl hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products, brands and more"
              className="pl-10 bg-background text-foreground border-0 focus-visible:ring-1 focus-visible:ring-ring"
              data-testid="input-search"
              onClick={() => setLocation("/search")}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground relative"
              onClick={() => setLocation("/cart")}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 text-xs bg-destructive text-destructive-foreground border-2 border-primary"
                  data-testid="badge-cart-count"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="px-4 pb-3 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products"
              className="pl-10 bg-background text-foreground border-0"
              data-testid="input-search-mobile"
              onClick={() => setLocation("/search")}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
