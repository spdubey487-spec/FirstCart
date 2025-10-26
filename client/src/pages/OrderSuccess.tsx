import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function OrderSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3" data-testid="heading-success">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We've received your order and will process it shortly.
          </p>

          <div className="bg-muted p-6 rounded-lg mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">What's next?</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Track your order status in the Account section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Expected delivery within 3-5 business days</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation("/")}
              size="lg"
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/account")}
              size="lg"
              data-testid="button-view-orders"
            >
              View Orders
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
