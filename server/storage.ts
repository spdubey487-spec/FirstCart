import {
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type Review,
  type InsertReview,
  type CartItemWithProduct,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Cart
  getCartBySession(sessionId: string): Promise<CartItem[]>;
  getCartItemsWithProducts(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  
  // Reviews
  getReviewsByProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    
    this.seedData();
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Cart
  async getCartBySession(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async getCartItemsWithProducts(sessionId: string): Promise<CartItemWithProduct[]> {
    const cartItems = await this.getCartBySession(sessionId);
    const itemsWithProducts: CartItemWithProduct[] = [];

    for (const item of cartItems) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
        });
      }
    }

    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) =>
        item.sessionId === insertItem.sessionId &&
        item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const item: CartItem = { ...insertItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    itemsToDelete.forEach((item) => this.cartItems.delete(item.id));
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // Reviews
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { ...insertReview, id };
    this.reviews.set(id, review);
    return review;
  }

  // Seed initial data
  private seedData() {
    // Create categories
    const categories: InsertCategory[] = [
      { name: "Electronics", icon: "smartphone", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop" },
      { name: "Fashion", icon: "shirt", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop" },
      { name: "Home", icon: "home", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop" },
      { name: "Beauty", icon: "sparkles", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop" },
      { name: "Books", icon: "book", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop" },
      { name: "Sports", icon: "dumbbell", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop" },
    ];

    categories.forEach((cat) => {
      const id = randomUUID();
      this.categories.set(id, { ...cat, id });
    });

    // Create products
    const products: InsertProduct[] = [
      // Electronics
      {
        name: "Wireless Noise Cancelling Headphones",
        description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for travel and daily commute.",
        price: "199.99",
        originalPrice: "299.99",
        discount: 33,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"],
        category: "Electronics",
        rating: "4.5",
        reviewCount: 1248,
        inStock: true,
        brand: "AudioTech",
        specifications: ["Battery: 30 hours", "Weight: 250g", "Bluetooth 5.0", "Active Noise Cancellation"],
      },
      {
        name: "4K Ultra HD Smart TV 55 inch",
        description: "Experience stunning 4K resolution with HDR support, built-in streaming apps, and voice control. Transform your living room into a cinema.",
        price: "549.99",
        originalPrice: "799.99",
        discount: 31,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop"],
        category: "Electronics",
        rating: "4.7",
        reviewCount: 892,
        inStock: true,
        brand: "VisionMax",
        specifications: ["Screen: 55 inches", "Resolution: 4K UHD", "HDR10+", "Smart TV Features"],
      },
      {
        name: "Smartphone 128GB - Latest Model",
        description: "Flagship smartphone with triple camera system, 6.7-inch OLED display, 5G connectivity, and all-day battery life.",
        price: "899.99",
        originalPrice: "1099.99",
        discount: 18,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1592286927505-c5b2e3daa40e?w=500&h=500&fit=crop"],
        category: "Electronics",
        rating: "4.6",
        reviewCount: 2341,
        inStock: true,
        brand: "TechPhone",
        specifications: ["Storage: 128GB", "RAM: 8GB", "Display: 6.7-inch OLED", "5G Enabled"],
      },
      {
        name: "Wireless Bluetooth Speaker",
        description: "Portable waterproof speaker with 360-degree sound, 12-hour battery, and deep bass. Perfect for outdoor adventures.",
        price: "79.99",
        originalPrice: "129.99",
        discount: 38,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop"],
        category: "Electronics",
        rating: "4.4",
        reviewCount: 567,
        inStock: true,
        brand: "SoundWave",
        specifications: ["Battery: 12 hours", "Waterproof: IPX7", "Bluetooth 5.0", "360° Sound"],
      },

      // Fashion
      {
        name: "Men's Premium Cotton T-Shirt",
        description: "Ultra-soft 100% cotton t-shirt with modern fit. Available in multiple colors. Perfect for casual everyday wear.",
        price: "24.99",
        originalPrice: "39.99",
        discount: 37,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"],
        category: "Fashion",
        rating: "4.3",
        reviewCount: 423,
        inStock: true,
        brand: "StyleCo",
        specifications: ["Material: 100% Cotton", "Fit: Modern", "Machine Washable", "Sizes: S-XXL"],
      },
      {
        name: "Women's Designer Handbag",
        description: "Elegant leather handbag with adjustable strap and multiple compartments. Perfect for work or special occasions.",
        price: "149.99",
        originalPrice: "249.99",
        discount: 40,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop"],
        category: "Fashion",
        rating: "4.8",
        reviewCount: 765,
        inStock: true,
        brand: "LuxeBag",
        specifications: ["Material: Genuine Leather", "Dimensions: 30x25x12cm", "Multiple Pockets", "Adjustable Strap"],
      },
      {
        name: "Running Shoes - Athletic Performance",
        description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Engineered for speed and comfort.",
        price: "89.99",
        originalPrice: "139.99",
        discount: 36,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"],
        category: "Fashion",
        rating: "4.5",
        reviewCount: 1034,
        inStock: true,
        brand: "SpeedFit",
        specifications: ["Weight: 240g", "Breathable Mesh", "Cushioned Sole", "Sizes: 6-13"],
      },

      // Home
      {
        name: "Robot Vacuum Cleaner with Mapping",
        description: "Smart robot vacuum with laser navigation, automatic charging, and app control. Keep your home spotlessly clean effortlessly.",
        price: "299.99",
        originalPrice: "499.99",
        discount: 40,
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop"],
        category: "Home",
        rating: "4.6",
        reviewCount: 891,
        inStock: true,
        brand: "CleanBot",
        specifications: ["Battery: 120 min", "Laser Navigation", "App Control", "Auto Charging"],
      },
      {
        name: "Air Purifier with HEPA Filter",
        description: "Remove 99.97% of airborne particles with this powerful air purifier. Quiet operation and smart sensors for optimal air quality.",
        price: "179.99",
        originalPrice: "259.99",
        discount: 31,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop"],
        category: "Home",
        rating: "4.7",
        reviewCount: 654,
        inStock: true,
        brand: "PureAir",
        specifications: ["HEPA Filter", "Coverage: 500 sq ft", "Noise: 25dB", "Smart Sensors"],
      },
      {
        name: "Coffee Maker with Grinder",
        description: "Wake up to freshly ground coffee every morning. Programmable timer, thermal carafe, and adjustable strength settings.",
        price: "129.99",
        originalPrice: "199.99",
        discount: 35,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop"],
        category: "Home",
        rating: "4.4",
        reviewCount: 423,
        inStock: true,
        brand: "BrewMaster",
        specifications: ["Built-in Grinder", "Programmable", "12-Cup Capacity", "Thermal Carafe"],
      },

      // Beauty
      {
        name: "Anti-Aging Face Serum",
        description: "Powerful anti-aging serum with hyaluronic acid and vitamin C. Reduces wrinkles and brightens skin tone for a youthful glow.",
        price: "49.99",
        originalPrice: "89.99",
        discount: 44,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop"],
        category: "Beauty",
        rating: "4.6",
        reviewCount: 1123,
        inStock: true,
        brand: "GlowSkin",
        specifications: ["Volume: 30ml", "Hyaluronic Acid", "Vitamin C", "Dermatologist Tested"],
      },
      {
        name: "Professional Hair Dryer",
        description: "Salon-quality hair dryer with ionic technology and multiple heat settings. Achieve smooth, frizz-free results at home.",
        price: "69.99",
        originalPrice: "119.99",
        discount: 42,
        image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop"],
        category: "Beauty",
        rating: "4.5",
        reviewCount: 678,
        inStock: true,
        brand: "HairPro",
        specifications: ["Power: 1800W", "Ionic Technology", "3 Heat Settings", "Cool Shot Button"],
      },

      // Books
      {
        name: "The Art of Modern Living",
        description: "A comprehensive guide to minimalist living and mindful consumption. Transform your life with practical tips and inspiring stories.",
        price: "19.99",
        originalPrice: "29.99",
        discount: 33,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop"],
        category: "Books",
        rating: "4.7",
        reviewCount: 892,
        inStock: true,
        brand: "Mindful Press",
        specifications: ["Pages: 320", "Hardcover", "Language: English", "ISBN: 978-1234567890"],
      },
      {
        name: "Complete Cookbook Collection",
        description: "Over 500 recipes from around the world. From quick weeknight dinners to impressive dinner party dishes.",
        price: "34.99",
        originalPrice: "49.99",
        discount: 30,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=500&fit=crop"],
        category: "Books",
        rating: "4.8",
        reviewCount: 1456,
        inStock: true,
        brand: "Gourmet Books",
        specifications: ["Pages: 450", "Hardcover", "500+ Recipes", "Full Color Photos"],
      },

      // Sports
      {
        name: "Yoga Mat - Extra Thick Non-Slip",
        description: "Premium yoga mat with superior cushioning and grip. Eco-friendly materials, perfect for all types of yoga and fitness.",
        price: "39.99",
        originalPrice: "69.99",
        discount: 43,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop"],
        category: "Sports",
        rating: "4.6",
        reviewCount: 734,
        inStock: true,
        brand: "ZenFit",
        specifications: ["Thickness: 6mm", "Non-Slip Surface", "Eco-Friendly", "Includes Carry Strap"],
      },
      {
        name: "Dumbbell Set - Adjustable Weight",
        description: "Space-saving adjustable dumbbells with easy weight selection. Perfect for home workouts and strength training.",
        price: "249.99",
        originalPrice: "399.99",
        discount: 37,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop"],
        category: "Sports",
        rating: "4.7",
        reviewCount: 567,
        inStock: true,
        brand: "PowerFit",
        specifications: ["Weight Range: 5-50 lbs", "Quick Adjust", "Compact Design", "Durable Construction"],
      },
    ];

    products.forEach((prod) => {
      const id = randomUUID();
      this.products.set(id, { ...prod, id });
    });

    // Create sample reviews
    const productIds = Array.from(this.products.keys());
    const sampleReviews: Omit<InsertReview, "productId">[] = [
      { rating: 5, comment: "Excellent product! Exceeded my expectations.", reviewerName: "Sarah M.", helpful: 12 },
      { rating: 4, comment: "Great quality, fast delivery. Highly recommend!", reviewerName: "John D.", helpful: 8 },
      { rating: 5, comment: "Best purchase I've made this year. Worth every penny!", reviewerName: "Emily R.", helpful: 15 },
      { rating: 4, comment: "Good value for money. Very satisfied with my purchase.", reviewerName: "Michael T.", helpful: 6 },
      { rating: 3, comment: "It's okay, does the job but nothing special.", reviewerName: "Lisa K.", helpful: 3 },
    ];

    productIds.slice(0, 5).forEach((productId) => {
      sampleReviews.forEach((review) => {
        const id = randomUUID();
        this.reviews.set(id, { ...review, productId, id });
      });
    });
  }
}

export const storage = new MemStorage();
