import { Link } from "react-router-dom";
import {
  Package,
  Cylinder,
  Layers,
  Mountain,
  Paintbrush,
  Zap,
  Droplets,
  Grid3X3,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Package,
  Cylinder,
  Layers,
  Mountain,
  Paintbrush,
  Zap,
  Droplets,
  Grid3X3,
};

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Browse our wide range of quality construction materials
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category, index) => {
            const Icon = iconMap[category.icon] || Package;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group p-6 rounded-xl bg-card border card-hover text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.productCount} Products
                </p>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
