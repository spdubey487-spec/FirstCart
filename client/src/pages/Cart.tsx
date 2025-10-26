import { useQuery, useMutation } from "@tanstack/react-query";
import type { CartItemWithProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/session";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const sessionId = getSessionId();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart/items", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/items?sessionId=${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch cart items");
      return response.json();
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/cart/items", sessionId] });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update cart item quantity",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/cart/items", sessionId] });
      toast({
        title: "Item removed",
        description: "Product has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Remove failed",
        description: "Could not remove item from cart",
        variant: "destructive",
      });
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const savings = cartItems.reduce((sum, item) => {
    const discount = item.product.originalPrice
      ? Number(item.product.originalPrice) - Number(item.product.price)
      : 0;
    return sum + discount * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 50 ? 0 : 5;
  const total = subtotal + deliveryFee;

  if (isLoading) {
    return (
      <div className="pb-20 md:pb-8 p-4">
        <Skeleton className="h-8 w-32 mb-6" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pb-20 md:pb-8">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2" data-testid="text-empty-cart">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Add items to your cart to see them here
        </p>
        <Button onClick={() => setLocation("/")} data-testid="button-shop-now">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" data-testid="heading-cart">
          Shopping Cart ({cartItems.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4" data-testid={`cart-item-${item.id}`}>
                <div className="flex gap-4">
                  {/* Product image */}
                  <div
                    className="w-24 h-24 bg-muted rounded-md overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => setLocation(`/product/${item.product.id}`)}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold line-clamp-2 cursor-pointer hover:text-primary"
                      onClick={() => setLocation(`/product/${item.product.id}`)}
                      data-testid={`text-cart-product-${item.id}`}
                    >
                      {item.product.name}
                    </h3>
                    {item.product.brand && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.brand}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-bold">
                        ${item.product.price}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              id: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold" data-testid={`text-quantity-${item.id}`}>
                          {updateQuantityMutation.isPending ? "..." : item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={updateQuantityMutation.isPending}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemMutation.mutate(item.id)}
                        className="text-destructive"
                        disabled={removeItemMutation.isPending}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {removeItemMutation.isPending ? "Removing..." : "Remove"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Savings</span>
                    <span className="font-semibold text-success">
                      -${savings.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free delivery
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg" data-testid="text-total">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setLocation("/checkout")}
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
