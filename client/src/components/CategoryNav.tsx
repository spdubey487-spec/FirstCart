import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CategoryNav() {
  const [location, setLocation] = useLocation();
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="bg-background border-b border-border">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-b border-border sticky top-[112px] sm:top-[72px] z-40">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        <Button
          variant={!location.includes("/category/") ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap shrink-0 snap-start"
          onClick={() => setLocation("/")}
          data-testid="category-all"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={location === `/category/${category.name.toLowerCase()}` ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap shrink-0 snap-start"
            onClick={() => setLocation(`/category/${category.name.toLowerCase()}`)}
            data-testid={`category-${category.name.toLowerCase()}`}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
