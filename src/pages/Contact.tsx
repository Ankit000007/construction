import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { COMPANY, SOCIAL_LINKS } from "@/lib/constants";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 text-secondary-foreground/80 max-w-xl mx-auto">
            Have questions about our products or need a quote? We're here to help!
          </p>
        </div>
      </div>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card p-6 lg:p-8 rounded-xl border">
            <h2 className="text-2xl font-heading font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your requirements..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-primary-gradient gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground">
                Reach out to us through any of the following channels. We respond within 24 hours!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <a
                href={SOCIAL_LINKS.phone}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border hover:border-primary transition-colors group"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">{COMPANY.phone}</p>
                  <p className="text-sm text-primary mt-1">Click to call →</p>
                </div>
              </a>

              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl bg-card border hover:border-primary transition-colors group"
              >
                <div className="h-12 w-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-muted-foreground">{COMPANY.phone}</p>
                  <p className="text-sm text-primary mt-1">Chat with us →</p>
                </div>
              </a>

              <a
                href={SOCIAL_LINKS.email}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border hover:border-primary transition-colors group"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">{COMPANY.email}</p>
                  <p className="text-sm text-primary mt-1">Send us an email →</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Saturday</p>
                  <p className="text-muted-foreground">9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button asChild className="btn-primary-gradient gap-2 flex-1">
                <a href={SOCIAL_LINKS.phone}>
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 flex-1">
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
