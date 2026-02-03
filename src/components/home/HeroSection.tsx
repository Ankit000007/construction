import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, SOCIAL_LINKS } from "@/lib/constants";
import heroImage from "@/assets/hero-construction.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Construction site"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
      </div>

      {/* Content */}
      <div className="relative container-custom py-20 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-primary-foreground text-sm font-medium">
              Trusted by 1000+ Builders
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Quality Construction
            <span className="text-primary block">Materials Delivered</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {COMPANY.name} brings you premium cement, TMT bars, bricks, sand, and all construction essentials at wholesale prices with fast delivery.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="btn-primary-gradient gap-2">
              <Link to="/products">
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Get Quote on WhatsApp
              </a>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap gap-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-white/90">
              <p className="text-3xl font-bold font-heading">5000+</p>
              <p className="text-sm text-white/60">Orders Delivered</p>
            </div>
            <div className="text-white/90">
              <p className="text-3xl font-bold font-heading">50+</p>
              <p className="text-sm text-white/60">Brand Partners</p>
            </div>
            <div className="text-white/90">
              <p className="text-3xl font-bold font-heading">24hr</p>
              <p className="text-sm text-white/60">Fast Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
