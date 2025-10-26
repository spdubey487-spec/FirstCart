import { useQuery, useMutation } from "@tanstack/react-query";
import type { CartItemWithProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { getSessionId } from "@/lib/session";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const sessionId = getSessionId();

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart/items", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/items?sessionId=${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch cart items");
      return response.json();
    },
  });

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const total = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );

      return apiRequest("POST", "/api/orders", {
        ...data,
        items: JSON.stringify(
          cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          }))
        ),
        total: total.toString(),
        sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/cart/items", sessionId] });
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase",
      });
      setLocation("/order-success");
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 50 ? 0 : 5;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items to checkout</p>
        <Button onClick={() => setLocation("/")}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" data-testid="heading-checkout">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Delivery Information</h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => placeOrderMutation.mutate(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1234567890"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main St, City, State, ZIP"
                            {...field}
                            data-testid="input-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={placeOrderMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {placeOrderMutation.isPending 
                      ? <span data-testid="text-placing-order">Placing Order...</span>
                      : "Place Order"}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg" data-testid="text-total-amount">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
