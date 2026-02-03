import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Phone,
  MessageCircle,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { FEATURED_PRODUCTS, SOCIAL_LINKS, COMPANY } from "@/lib/constants";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // Find product (in real app, this would be an API call)
  const product = FEATURED_PRODUCTS.find((p) => p.id === id) || FEATURED_PRODUCTS[0];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      unit: product.unit,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/products" className="text-muted-foreground hover:text-primary">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl bg-card border overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail gallery placeholder */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className={`w-20 h-20 rounded-lg bg-card border overflow-hidden ${
                    i === 1 ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && <Badge className="badge-new">NEW ARRIVAL</Badge>}
              {discount > 0 && <Badge className="badge-sale">{discount}% OFF</Badge>}
              {product.inStock && (
                <Badge variant="outline" className="text-success border-success">
                  In Stock
                </Badge>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                {product.category.replace("-", " ")}
              </p>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-sm text-muted-foreground">{product.unit}</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground">
              Premium quality {product.name.toLowerCase()} from trusted manufacturers. 
              Ideal for all types of construction projects. Complies with industry standards 
              and backed by quality assurance.
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap gap-4">
              {/* Quantity */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart */}
              <Button
                className="flex-1 btn-primary-gradient gap-2"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>

              {/* Wishlist */}
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>

              {/* Share */}
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="gap-2">
                <a href={SOCIAL_LINKS.phone}>
                  <Phone className="h-4 w-4" />
                  Call for Best Price
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Free Delivery</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Quality Assured</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground">
                  {product.name} is a premium quality construction material sourced from 
                  leading manufacturers. It meets all industry standards and is suitable 
                  for residential, commercial, and industrial construction projects.
                </p>
                <h4 className="font-semibold mt-4 mb-2">Key Features:</h4>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>High quality and durability</li>
                  <li>Meets BIS standards</li>
                  <li>Suitable for all construction types</li>
                  <li>Competitive pricing</li>
                  <li>Bulk orders available</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Brand", value: product.name.split(" ")[0] },
                  { label: "Category", value: product.category.replace("-", " ") },
                  { label: "Unit", value: product.unit },
                  { label: "Weight", value: "50 kg (varies)" },
                  { label: "Standard", value: "BIS Certified" },
                  { label: "Availability", value: product.inStock ? "In Stock" : "Out of Stock" },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Customer reviews will be displayed here.
                </p>
                <Button variant="outline" className="mt-4">
                  Write a Review
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
