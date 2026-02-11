import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const txnId = searchParams.get("txnId");
  const amount = searchParams.get("amount");
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (status === "success") {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-xl border max-w-md w-full text-center space-y-6">
        {status === "success" && (
          <>
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-green-600">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Your order has been placed successfully. We'll deliver your
              construction materials soon.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
              )}
              {txnId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{txnId}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold">
                    ₹{parseFloat(amount).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-red-600">
              Payment Failed
            </h1>
            <p className="text-muted-foreground">
              {reason
                ? decodeURIComponent(reason)
                : "Your payment could not be processed. Please try again."}
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
          </>
        )}

        {status === "pending" && (
          <>
            <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-yellow-600">
              Payment Pending
            </h1>
            <p className="text-muted-foreground">
              Your payment is being processed. We'll update you once it's
              confirmed.
            </p>
            {orderId && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">
                      ₹{parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild className="flex-1 btn-primary-gradient">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
