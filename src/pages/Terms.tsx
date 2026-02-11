import { COMPANY } from "@/lib/constants";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Terms & Conditions</h1>
          <p className="mt-4 text-secondary-foreground/80">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="container-custom py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-heading font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">
            By accessing and using {COMPANY.name}'s website and services, you agree to be bound by 
            these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">2. Products and Pricing</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>All prices are in Indian Rupees (INR) and are subject to change without notice</li>
            <li>Prices may vary based on quantity, location, and market conditions</li>
            <li>Product images are for illustration purposes and actual products may vary slightly</li>
            <li>We reserve the right to limit quantities on any product</li>
          </ul>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">3. Orders and Payment</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>Orders are subject to acceptance and availability</li>
            <li>We currently accept Cash on Delivery (COD) as the primary payment method</li>
            <li>Full payment is required upon delivery of goods</li>
            <li>We reserve the right to cancel orders in case of pricing errors or stock unavailability</li>
          </ul>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">4. Delivery</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>Delivery times are estimates and may vary based on location and product availability</li>
            <li>Free delivery is available for orders above the minimum order value</li>
            <li>Delivery charges may apply for orders below the minimum value or remote locations</li>
            <li>Customer must provide accurate delivery address and contact information</li>
          </ul>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">5. Returns and Refunds</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>Products must be inspected at the time of delivery</li>
            <li>Damaged or defective products will be replaced at no extra cost</li>
            <li>Returns must be requested within 24 hours of delivery</li>
            <li>Refunds will be processed after inspection of returned goods</li>
          </ul>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">6. Contact Information</h2>
          <p className="text-muted-foreground">
            For any questions regarding these terms, please contact us at{" "}
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

export default Terms;
