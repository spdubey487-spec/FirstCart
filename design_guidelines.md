# FirstCart Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing primary inspiration from Flipkart's mobile-optimized interface with supporting patterns from Amazon and Myntra for a comprehensive e-commerce experience.

**Core Principle**: Mobile-first design prioritizing quick product discovery, seamless browsing, and frictionless checkout flow optimized for thumb-friendly interactions.

---

## Typography System

**Font Stack**: Inter (primary), 'Segoe UI', system-ui, sans-serif via Google Fonts CDN

**Hierarchy**:
- Product titles: text-base (16px), font-semibold
- Category headers: text-2xl (24px), font-bold
- Price (large): text-xl (20px), font-bold
- Price (original/strikethrough): text-sm (14px), font-normal
- Body/descriptions: text-sm (14px), font-normal
- Buttons/CTAs: text-sm (14px), font-semibold
- Badges/labels: text-xs (12px), font-medium, uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 3, 4, 6, and 8
- Component padding: p-4
- Section spacing: py-6, py-8
- Card gaps: gap-3, gap-4
- Element margins: mb-2, mb-3, mb-4

**Grid Structure**:
- Product grid: grid-cols-2 (mobile), sm:grid-cols-3, lg:grid-cols-4
- Category tiles: grid-cols-3 gap-3
- Container: max-w-7xl mx-auto px-4

---

## Component Library

### Navigation System

**Top Header** (sticky):
- Search bar (prominent, full-width on mobile)
- Cart icon with badge counter
- User account icon
- Logo/branding (FirstCart)
- Height: h-16

**Category Navigation Bar** (horizontal scroll on mobile):
- Chip-style category buttons
- Horizontally scrollable: overflow-x-auto flex gap-2
- Categories: Electronics, Fashion, Home, Beauty, Books, etc.

### Product Components

**Product Card** (Flipkart-style):
- Product image (aspect-ratio-square, object-cover)
- Wishlist heart icon (top-right absolute)
- Product title (2-line clamp)
- Star rating with count
- Price display: Current price (bold) + Original price (line-through) + Discount percentage (badge)
- Delivery info badge
- Rounded corners: rounded-lg
- Shadow: shadow-sm, hover:shadow-md transition

**Product Detail Page**:
- Image carousel with thumbnail navigation
- Sticky "Add to Cart" bottom bar on mobile
- Specs table with alternating row backgrounds
- Customer reviews section with star filters
- Similar products carousel

### Shopping Experience

**Cart Badge**: Absolute positioned, rounded-full, with item count

**Add to Cart Button**: 
- Full-width on mobile (sticky bottom)
- Blurred background when overlaid on images: backdrop-blur-md bg-white/80
- Icon + Text combination
- No hover states (as specified)

**Filters Panel**:
- Slide-in drawer on mobile
- Checkbox groups for categories, price ranges, ratings
- Clear all filters button
- Apply button (sticky bottom)

### Special Components

**Flash Sale Banner**: 
- Countdown timer
- Horizontal scroll of deal products
- Animated border or pulse effect on timer

**Category Showcase Tiles**:
- Image-based tiles in 3-column grid
- Text overlay with category name
- Subtle gradient overlay for text readability

**Search Bar**:
- Icon prefix (magnifying glass from Heroicons)
- Recent searches dropdown
- Auto-suggestions
- Voice search icon (optional mic icon)

---

## Images

### Hero Section
**Large hero carousel** featuring:
- Promotional banners (aspect-ratio: 16/9 on mobile, 21/9 on desktop)
- Featured product categories with overlay text
- Seasonal sale announcements
- Auto-rotating carousel with dot indicators
- Images: High-quality lifestyle product photography with diverse backgrounds

### Product Images
- All product cards require square images (1:1 aspect ratio)
- Product detail pages: Multiple angles, zoom capability
- Lifestyle context shots for apparel/home categories
- White/clean backgrounds for electronics/accessories

### Category Sections
- Category tiles with representative product images
- Icon + image combination for sub-categories
- Background patterns or textures for section differentiation

---

## Interaction Patterns

**Touch Targets**: Minimum 44px (h-11) for all interactive elements

**Scrolling Behavior**:
- Horizontal product carousels: snap-x snap-mandatory
- Infinite scroll for product listings
- Pull-to-refresh on main feed

**Loading States**:
- Skeleton screens for product cards
- Shimmer effect during load
- Progressive image loading with blur-up

**Micro-interactions**:
- Cart counter bounces on add-to-cart
- Heart icon fills on wishlist add
- Subtle scale on product card tap
- Ripple effect on button press (Material-inspired)

---

## Page Structures

### Home Page
1. Hero carousel (full-width)
2. Category shortcuts (3-column grid)
3. Flash deals section (horizontal scroll)
4. Trending products (grid)
5. Category-wise product showcases (multiple sections)
6. Brand partnerships banner
7. App download CTA

### Product Listing Page
- Filter chips (top)
- Sort dropdown
- Product grid
- Load more button / Infinite scroll

### Checkout Flow
- Cart summary (collapsible on mobile)
- Address selection/entry
- Payment options (radio buttons)
- Order summary (sticky)
- Place order CTA (prominent)

---

## Icon Library

**Heroicons** via CDN (outline style for navigation, solid for buttons)

Key icons needed:
- Shopping cart, heart (wishlist), search, user profile
- Home, categories, offers, account (bottom nav)
- Star (ratings), truck (delivery), shield (warranty)
- Filter, sort, close, chevrons for carousels

---

## Accessibility

- Touch targets: minimum 44px
- Form labels: visible and descriptive
- Alt text for all product images
- ARIA labels for icon-only buttons
- Sufficient contrast for all text (WCAG AA compliant)
- Keyboard navigation support for desktop
- Focus indicators on all interactive elements

---

## Mobile-Specific Optimizations

**Bottom Navigation Bar** (fixed):
- 5 items: Home, Categories, Cart, Offers, Account
- Active state indication
- Icons from Heroicons with labels

**Sticky Elements**:
- Header with search (top)
- Add to cart button (bottom) on product pages
- Bottom navigation (global)

**Gestures**:
- Swipe for image carousels
- Pull down to refresh feed
- Swipe to remove cart items