import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Heart, MapPin, CreditCard, Settings, LogOut } from "lucide-react";

export default function Account() {
  const menuItems = [
    { icon: ShoppingBag, label: "My Orders", description: "Track, return or buy again" },
    { icon: Heart, label: "Wishlist", description: "Your saved items" },
    { icon: MapPin, label: "Addresses", description: "Manage delivery addresses" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage your payment options" },
    { icon: Settings, label: "Settings", description: "Manage your account preferences" },
  ];

  return (
    <div className="pb-20 md:pb-8">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Profile section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold" data-testid="text-username">Guest User</h2>
              <p className="text-sm text-muted-foreground">guest@firstcart.com</p>
            </div>
            <Button variant="outline" data-testid="button-edit-profile">
              Edit
            </Button>
          </div>
        </Card>

        {/* Menu items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className="p-4 cursor-pointer hover-elevate active-elevate-2"
                data-testid={`card-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Logout button */}
        <Button
          variant="outline"
          className="w-full mt-6 text-destructive"
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
