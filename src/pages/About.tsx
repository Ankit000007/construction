import { Link } from "react-router-dom";
import { Building2, Users, Target, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, SOCIAL_LINKS } from "@/lib/constants";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            About <span className="text-primary">{COMPANY.name}</span>
          </h1>
          <p className="mt-4 text-secondary-foreground/80 max-w-xl mx-auto">
            Your trusted partner in quality construction materials
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
                Building <span className="text-primary">Tomorrow</span>, Today
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {COMPANY.name} was founded with a simple mission: to make quality 
                  construction materials accessible to everyone. Whether you're building 
                  your dream home or managing a large commercial project, we're here to 
                  supply the best materials at competitive prices.
                </p>
                <p>
                  We partner with leading brands like UltraTech, ACC, TATA, Asian Paints, 
                  and more to bring you a comprehensive range of construction essentials 
                  - from cement and TMT bars to paints, electrical, and plumbing supplies.
                </p>
                <p>
                  Our commitment to quality, transparency, and customer satisfaction has 
                  made us a trusted name among contractors, builders, and homeowners across 
                  the region.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="btn-primary-gradient">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-xl border text-center">
                  <p className="text-4xl font-bold text-primary">5000+</p>
                  <p className="text-sm text-muted-foreground mt-1">Orders Delivered</p>
                </div>
                <div className="bg-card p-6 rounded-xl border text-center">
                  <p className="text-4xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground mt-1">Brand Partners</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-card p-6 rounded-xl border text-center">
                  <p className="text-4xl font-bold text-primary">1000+</p>
                  <p className="text-sm text-muted-foreground mt-1">Happy Customers</p>
                </div>
                <div className="bg-card p-6 rounded-xl border text-center">
                  <p className="text-4xl font-bold text-primary">24hr</p>
                  <p className="text-sm text-muted-foreground mt-1">Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-12">
            Our <span className="text-primary">Values</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Quality First",
                description: "Only genuine, certified products from trusted brands",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description: "Your satisfaction is our top priority",
              },
              {
                icon: Target,
                title: "Fair Pricing",
                description: "Competitive wholesale prices with no hidden costs",
              },
              {
                icon: Building2,
                title: "Reliability",
                description: "On-time delivery you can count on",
              },
            ].map((value, index) => (
              <div
                key={value.title}
                className="text-center p-6 bg-card rounded-xl border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8">
              Why Choose <span className="text-primary">Us?</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                "Wide range of quality construction materials",
                "Trusted brands like UltraTech, TATA, ACC, Asian Paints",
                "Competitive wholesale pricing",
                "Fast and reliable delivery service",
                "Expert advice and support",
                "Easy ordering via phone or WhatsApp",
                "Bulk order discounts available",
                "Hassle-free returns policy",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Get in touch with us today for the best prices and personalized service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <a href={SOCIAL_LINKS.phone}>Call {COMPANY.phone}</a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90"
            >
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
