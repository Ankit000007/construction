import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { COMPANY, CATEGORIES, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <span className="text-primary-foreground font-heading font-bold text-xl">IC</span>
              </div>
              <h3 className="font-heading font-bold text-lg">{COMPANY.name}</h3>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              {COMPANY.description}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${category.id}`}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={SOCIAL_LINKS.phone}
                  className="flex items-start gap-3 text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{COMPANY.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.email}
                  className="flex items-start gap-3 text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{COMPANY.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/80 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/80 text-sm">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/60">
            <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
            <p>Designed for quality construction</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
