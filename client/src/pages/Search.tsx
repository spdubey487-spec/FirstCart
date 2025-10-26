import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: filteredProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search");
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Search input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            autoFocus
            data-testid="input-search-query"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery("")}
              data-testid="button-clear-search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Results */}
        {!searchQuery.trim() ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Search for products</h2>
            <p className="text-muted-foreground text-center">
              Enter a keyword to find products
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2" data-testid="text-no-results">No results found</h2>
            <p className="text-muted-foreground text-center">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4" data-testid="text-results-count">
              {filteredProducts.length} results for "{searchQuery}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
