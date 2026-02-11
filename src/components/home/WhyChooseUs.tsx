import {
  ShieldCheck,
  IndianRupee,
  Truck,
  Headphones,
} from "lucide-react";
import { WHY_CHOOSE_US } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  IndianRupee,
  Truck,
  Headphones,
};

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-secondary text-secondary-foreground">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Why Choose <span className="text-primary">Us?</span>
          </h2>
          <p className="mt-4 text-secondary-foreground/80">
            We're committed to providing the best construction materials and service
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {WHY_CHOOSE_US.map((feature, index) => {
            const Icon = iconMap[feature.icon] || ShieldCheck;
            return (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl bg-secondary-foreground/5 border border-secondary-foreground/10 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-foreground/70">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
