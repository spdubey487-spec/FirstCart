import { Home, Grid3x3, ShoppingCart, Tag, User } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid3x3, label: "Categories", path: "/categories" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: Tag, label: "Deals", path: "/deals" },
  { icon: User, label: "Account", path: "/account" },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-card-border shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full hover-elevate active-elevate-2 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
