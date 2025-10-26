import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export default function Category() {
  const { name } = useParams<{ name: string }>();
  const categoryName = name?.charAt(0).toUpperCase() + name?.slice(1) || "";

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = allProducts.filter(
    (p) => p.category.toLowerCase() === name?.toLowerCase()
  );

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="heading-category">
              {categoryName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} products found
            </p>
          </div>
          <Button variant="outline" size="sm" data-testid="button-filters">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-xl font-bold mb-2">No products found</h2>
            <p className="text-muted-foreground">
              We couldn't find any products in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
