import { COMPANY } from "@/lib/constants";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Privacy Policy</h1>
          <p className="mt-4 text-secondary-foreground/80">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="container-custom py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-heading font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            At {COMPANY.name}, we collect information you provide directly to us, such as when you 
            place an order, contact us for support, or sign up for our services. This includes:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>Name and contact information (phone number, email address)</li>
            <li>Delivery address</li>
            <li>Order details and preferences</li>
            <li>Communication history with our team</li>
          </ul>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and inquiries</li>
            <li>Send you updates about products and services</li>
            <li>Improve our services and customer experience</li>
          </ul>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground mb-6">
            We do not sell, trade, or rent your personal information to third parties. We may share 
            your information with delivery partners to fulfill your orders and with service providers 
            who assist us in operating our business.
          </p>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">4. Data Security</h2>
          <p className="text-muted-foreground mb-6">
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">5. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
              {COMPANY.email}
            </a>{" "}
            or call us at{" "}
            <a href={`tel:${COMPANY.phone}`} className="text-primary hover:underline">
              {COMPANY.phone}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
