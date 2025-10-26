import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

export default function Deals() {
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const dealProducts = allProducts.filter((p) => (p.discount || 0) > 0);

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="heading-deals">
              Deals & Offers
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {dealProducts.length} deals available
          </p>
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
        ) : dealProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Tag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">No deals available</h2>
            <p className="text-muted-foreground">Check back later for amazing offers</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
