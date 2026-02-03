import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { FEATURED_PRODUCTS } from "@/lib/constants";

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top-quality materials at competitive prices
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline shrink-0"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED_PRODUCTS.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
