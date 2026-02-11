import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Minus, Plus, Phone, MessageCircle, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { COMPANY, SOCIAL_LINKS } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";

const PAYMENT_SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaytmPayment = async (customerName: string, customerEmail: string, customerPhone: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/api/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          customerName,
          customerEmail,
          customerPhone,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirect to Paytm payment page
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.message || "Failed to initiate payment. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Unable to connect to payment server. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      toast.error("Please accept Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const customerName = (form.querySelector("#name") as HTMLInputElement).value;
    const customerEmail = (form.querySelector("#email") as HTMLInputElement).value;
    const customerPhone = (form.querySelector("#phone") as HTMLInputElement).value;

    if (paymentMethod === "paytm") {
      handlePaytmPayment(customerName, customerEmail, customerPhone);
      return;
    }

    // Create WhatsApp message with order details
    const orderDetails = items
      .map((item) => `• ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`)
      .join("\n");

    const message = `🛒 *New Order from ${COMPANY.name}*\n\n${orderDetails}\n\n*Total: ₹${totalPrice.toLocaleString()}*\n\nPayment: ${paymentMethod === "cod" ? "Cash on Delivery" : "Request Quote"}`;

    const whatsappUrl = `https://wa.me/${COMPANY.phoneClean}?text=${encodeURIComponent(message)}`;

    toast.success("Order placed successfully! We'll contact you shortly.");
    clearCart();
    window.open(whatsappUrl, "_blank");
    navigate("/");
  };


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to checkout
          </p>
          <Button asChild className="btn-primary-gradient">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b py-4">
        <div className="container-custom">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="bg-card p-6 rounded-xl border">
              <h2 className="font-heading font-semibold text-lg mb-4">
                Delivery Details
              </h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      pattern="[0-9+\s-]+"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Complete delivery address with landmark"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="City" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" placeholder="Pincode" required />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-4">
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/30">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/30">
                      <RadioGroupItem value="paytm" id="paytm" />
                      <Label htmlFor="paytm" className="flex-1 cursor-pointer">
                        <span className="font-medium flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Pay Online (Paytm)
                        </span>
                        <p className="text-sm text-muted-foreground">
                          UPI, Debit/Credit Card, Net Banking, Wallet
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/30">
                      <RadioGroupItem value="enquiry" id="enquiry" />
                      <Label htmlFor="enquiry" className="flex-1 cursor-pointer">
                        <span className="font-medium">Request Quote</span>
                        <p className="text-sm text-muted-foreground">
                          We'll contact you with the best price
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Terms & Conditions */}
                <div className="pt-2">
                  <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30">
                    <Checkbox
                      id="agree"
                      checked={agree}
                      onCheckedChange={(value) => setAgree(value === true)}
                    />
                    <Label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary underline underline-offset-4">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy-policy" className="text-primary underline underline-offset-4">
                        Privacy Policy
                      </Link>
                      .
                    </Label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full btn-primary-gradient"
                    size="lg"
                    disabled={!agree || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : paymentMethod === "paytm" ? (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ₹{totalPrice.toLocaleString()} with Paytm
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Need Help */}
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="gap-2">
                  <a href={SOCIAL_LINKS.phone}>
                    <Phone className="h-4 w-4" />
                    Call Us
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-xl border sticky top-32">
              <h2 className="font-heading font-semibold text-lg mb-4">
                Order Summary ({items.length} items)
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-success">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Prices may vary based on location and availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
