import { Heart, Star, TruckIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const discount = product.discount || 0;
  const hasDiscount = discount > 0;

  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 flex flex-col h-full"
      onClick={() => setLocation(`/product/${product.id}`)}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image container */}
      <div className="relative aspect-square bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {hasDiscount && (
          <Badge
            className="absolute top-2 left-2 bg-success text-success-foreground"
            data-testid={`badge-discount-${product.id}`}
          >
            {discount}% OFF
          </Badge>
        )}
        <button
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover-elevate active-elevate-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
          data-testid={`button-wishlist-${product.id}`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {product.brand}
          </p>
        )}

        {/* Product name */}
        <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-success text-success-foreground rounded-sm">
            <span className="text-xs font-semibold" data-testid={`text-rating-${product.id}`}>{product.rating || "4.0"}</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-xs text-muted-foreground" data-testid={`text-review-count-${product.id}`}>
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-bold" data-testid={`text-price-${product.id}`}>
            ${product.price}
          </span>
          {hasDiscount && product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            </>
          )}
        </div>

        {/* Delivery info */}
        {product.inStock && (
          <div className="flex items-center gap-1 text-xs text-success mt-1">
            <TruckIcon className="h-3 w-3" />
            <span className="font-medium">Free Delivery</span>
          </div>
        )}
      </div>
    </Card>
  );
}
