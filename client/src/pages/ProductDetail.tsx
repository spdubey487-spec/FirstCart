import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Product, Review } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Heart, Share2, TruckIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getSessionId } from "@/lib/session";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const sessionId = getSessionId();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews", id],
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart", {
        productId: id,
        quantity: 1,
        sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Failed to add to cart",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="pb-20 md:pb-8">
        <div className="p-4">
          <Skeleton className="h-8 w-8 mb-4" />
          <Skeleton className="aspect-square w-full mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist</p>
        <Button onClick={() => setLocation("/")}>Go Home</Button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasDiscount = (product.discount || 0) > 0;

  return (
    <div className="pb-24 md:pb-8">
      {/* Back button */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Image gallery */}
      <div className="px-4">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid="img-product-main"
          />
          {hasDiscount && (
            <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
              {product.discount}% OFF
            </Badge>
          )}
        </div>

        {/* Thumbnail images */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`min-w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                data-testid={`button-thumbnail-${index}`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4 space-y-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h1 className="text-2xl font-bold" data-testid="text-product-name">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-success text-success-foreground rounded-md">
            <span className="font-semibold">{product.rating || "4.0"}</span>
            <Star className="h-4 w-4 fill-current" />
          </div>
          <span className="text-sm text-muted-foreground">
            {product.reviewCount || 0} ratings & {reviews.length} reviews
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold" data-testid="text-price">
            ${product.price}
          </span>
          {hasDiscount && product.originalPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
              <span className="text-lg text-success font-semibold">
                {product.discount}% off
              </span>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg">
            <TruckIcon className="h-5 w-5 text-success" />
            <span className="text-xs text-center font-medium">Free Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-xs text-center font-medium">Warranty</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg">
            <Star className="h-5 w-5 text-warning" />
            <span className="text-xs text-center font-medium">Top Rated</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Details</h3>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Specifications</h3>
            <div className="space-y-2">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 px-3 bg-muted rounded-md"
                >
                  <span className="text-sm font-medium">{spec.split(":")[0]}</span>
                  <span className="text-sm text-muted-foreground">{spec.split(":")[1]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.reviewerName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-warning text-warning"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t border-card-border p-4 shadow-lg z-30">
        <div className="flex gap-3 max-w-7xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            data-testid="button-wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            className="flex-1"
            size="lg"
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending || !product.inStock}
            data-testid="button-add-to-cart"
          >
            {addToCartMutation.isPending 
              ? <span data-testid="text-adding-to-cart">Adding...</span>
              : product.inStock 
                ? "Add to Cart" 
                : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
