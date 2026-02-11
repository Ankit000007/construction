import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Grid3X3, LayoutList, ChevronDown, Search, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/products/ProductCard";
import { CATEGORIES, FEATURED_PRODUCTS } from "@/lib/constants";
import { useWishlist } from "@/contexts/WishlistContext";

type PriceRange = "under-500" | "500-2000" | "2000-5000" | "above-5000";

const PRICE_RANGES: { id: PriceRange; label: string; min: number; max: number }[] = [
  { id: "under-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-2000", label: "₹500 - ₹2,000", min: 500, max: 2000 },
  { id: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000, max: Infinity },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const category = searchParams.get("category");
    return category ? [category] : [];
  });
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [showInStock, setShowInStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [showWishlistOnly, setShowWishlistOnly] = useState(() => searchParams.get("wishlist") === "true");
  const { wishlist } = useWishlist();

  // Sync search param to searchQuery when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
    const wishlistParam = searchParams.get("wishlist") === "true";
    setShowWishlistOnly(wishlistParam);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...FEATURED_PRODUCTS];

    // Wishlist filter
    if (showWishlistOnly) {
      products = products.filter((p) => wishlist.includes(p.id));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      products = products.filter((p) => selectedCategories.includes(p.category));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      const ranges = PRICE_RANGES.filter((r) => selectedPriceRanges.includes(r.id));
      products = products.filter((p) =>
        ranges.some((r) => p.price >= r.min && p.price < r.max)
      );
    }

    // Availability filter
    if (showInStock && !showOutOfStock) {
      products = products.filter((p) => p.inStock);
    } else if (!showInStock && showOutOfStock) {
      products = products.filter((p) => !p.inStock);
    } else if (!showInStock && !showOutOfStock) {
      products = [];
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products = products.filter((p) => p.isNew).concat(products.filter((p) => !p.isNew));
        break;
    }

    return products;
  }, [selectedCategories, searchQuery, sortBy, selectedPriceRanges, showInStock, showOutOfStock, showWishlistOnly, wishlist]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const togglePriceRange = (rangeId: PriceRange) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((r) => r !== rangeId)
        : [...prev, rangeId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setShowInStock(true);
    setShowOutOfStock(true);
    setSearchQuery("");
    setShowWishlistOnly(false);
    setSearchParams({});
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedPriceRanges.includes(range.id)}
                onCheckedChange={() => togglePriceRange(range.id)}
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={showInStock}
              onCheckedChange={(v) => setShowInStock(v === true)}
            />
            <span className="text-sm group-hover:text-primary transition-colors">
              In Stock
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={showOutOfStock}
              onCheckedChange={(v) => setShowOutOfStock(v === true)}
            />
            <span className="text-sm group-hover:text-primary transition-colors">
              Out of Stock
            </span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">
              {showWishlistOnly ? "Wishlist" : "Products"}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32 p-6 rounded-xl bg-card border">
              <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  {showWishlistOnly ? "My Wishlist" : "All Products"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || showWishlistOnly) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {showWishlistOnly && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setShowWishlistOnly(false);
                      searchParams.delete("wishlist");
                      setSearchParams(searchParams);
                    }}
                  >
                    Wishlist Only
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {selectedCategories.map((cat) => {
                  const category = CATEGORIES.find((c) => c.id === cat);
                  return (
                    <Button
                      key={cat}
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={() => toggleCategory(cat)}
                    >
                      {category?.name}
                      <span className="text-muted-foreground">×</span>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-4 lg:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <PackageSearch className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No products found</h3>
                <p className="text-muted-foreground">
                  {showWishlistOnly
                    ? "Your wishlist is empty. Start adding products you love!"
                    : "No products found matching your criteria. Try adjusting your filters."}
                </p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
