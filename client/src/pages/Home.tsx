import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const dealProducts = products.filter(p => (p.discount || 0) > 20).slice(0, 6);
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="pb-20 md:pb-8">
      {/* Hero Carousel */}
      <div className="px-4 py-4">
        <HeroCarousel />
      </div>

      {/* Flash Deals Section */}
      {dealProducts.length > 0 && (
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" data-testid="heading-flash-deals">
              Flash Deals
            </h2>
            <span className="text-sm text-muted-foreground">Limited Time</span>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-4 pb-2 snap-x snap-mandatory">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="min-w-[160px] snap-start">
                    <Skeleton className="aspect-square w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : (
                dealProducts.map((product) => (
                  <div key={product.id} className="min-w-[160px] sm:min-w-[200px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      <section className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-4" data-testid="heading-trending">
          Trending Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* All Products */}
      <section className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-4" data-testid="heading-all-products">
          All Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
