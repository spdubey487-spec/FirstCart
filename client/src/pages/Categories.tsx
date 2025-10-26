import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Categories() {
  const [, setLocation] = useLocation();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" data-testid="heading-categories">
          All Categories
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="overflow-hidden cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setLocation(`/category/${category.name.toLowerCase()}`)}
                data-testid={`card-category-${category.name.toLowerCase()}`}
              >
                <div className="aspect-square bg-muted relative">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-lg font-bold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
