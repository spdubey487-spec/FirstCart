import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    title: "Electronics Sale",
    subtitle: "Up to 60% Off on Top Brands",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=400&fit=crop",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Fashion Week",
    subtitle: "Trending Styles for Everyone",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop",
    cta: "Explore",
  },
  {
    id: 3,
    title: "Home Essentials",
    subtitle: "Transform Your Living Space",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&h=400&fit=crop",
    cta: "Discover",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full aspect-[21/9] sm:aspect-[21/7] overflow-hidden bg-muted rounded-lg">
      {/* Banners */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full h-full relative"
            data-testid={`banner-${banner.id}`}
          >
            {/* Background image with overlay */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                {banner.title}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 sm:mb-6">
                {banner.subtitle}
              </p>
              <div>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
                  data-testid={`button-cta-${banner.id}`}
                >
                  {banner.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons - hidden on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover-elevate active-elevate-2 hidden sm:flex"
        onClick={goToPrevious}
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover-elevate active-elevate-2 hidden sm:flex"
        onClick={goToNext}
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
