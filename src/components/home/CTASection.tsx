import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, SOCIAL_LINKS } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground">
            Ready to Start Your Project?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Get in touch with us for the best prices on quality construction materials.
            We offer free quotes and fast delivery!
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 gap-2"
            >
              <a href={SOCIAL_LINKS.phone}>
                <Phone className="h-5 w-5" />
                Call {COMPANY.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
            >
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>
            </Button>
          </div>

          {/* Email */}
          <p className="mt-6 text-sm text-primary-foreground/70">
            Or email us at{" "}
            <a
              href={SOCIAL_LINKS.email}
              className="underline hover:text-white transition-colors"
            >
              {COMPANY.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
