import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Phone, Mail, ShoppingCart, Menu, X, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COMPANY, NAV_LINKS, CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();

  const isActive = (href: string) => location.pathname === href;

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container-custom py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden sm:flex items-center gap-6">
              <a
                href={SOCIAL_LINKS.phone}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{COMPANY.phone}</span>
              </a>
              <a
                href={SOCIAL_LINKS.email}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{COMPANY.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-4 mx-auto sm:mx-0">
              <span className="text-primary font-medium">Free Delivery on Orders Above ₹10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-primary rounded-lg p-2">
                <span className="text-primary-foreground font-heading font-bold text-xl">IC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-lg leading-tight text-foreground">
                  {COMPANY.name}
                </h1>
                <p className="text-xs text-muted-foreground">{COMPANY.tagline}</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for cement, TMT bars, bricks..."
                  className="pl-10 pr-4 w-full bg-muted border-0 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                asChild
              >
                <Link to="/products?wishlist=true">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* CTA Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={SOCIAL_LINKS.phone}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button asChild size="sm" className="btn-primary-gradient">
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6 mt-6">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                      />
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex flex-col gap-2">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isActive(link.href)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Contact */}
                    <div className="border-t pt-4 space-y-3">
                      <a
                        href={SOCIAL_LINKS.phone}
                        className="flex items-center gap-3 px-4 py-2 text-sm"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        {COMPANY.phone}
                      </a>
                      <a
                        href={SOCIAL_LINKS.email}
                        className="flex items-center gap-3 px-4 py-2 text-sm"
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        {COMPANY.email}
                      </a>
                    </div>

                    {/* Mobile CTA */}
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline">
                        <a href={SOCIAL_LINKS.phone}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </a>
                      </Button>
                      <Button asChild className="btn-primary-gradient">
                        <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                          WhatsApp Us
                        </a>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <nav className="hidden lg:block bg-card border-b">
        <div className="container-custom">
          <div className="flex items-center gap-8">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 font-semibold text-primary">
                  <Menu className="h-4 w-4" />
                  All Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/products?category=${category.id}`} className="cursor-pointer">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                    isActive(link.href)
                      ? "border-primary text-primary"
                      : "border-transparent hover:text-primary hover:border-primary/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
