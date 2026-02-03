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

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            Shop by <span className="text-primary">Category</span>
          </h1>
          <p className="mt-4 text-secondary-foreground/80 max-w-xl mx-auto">
            Browse our complete range of construction materials
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => {
            const Icon = iconMap[category.icon] || Package;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group p-6 rounded-xl bg-card border card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {category.productCount} Products
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
