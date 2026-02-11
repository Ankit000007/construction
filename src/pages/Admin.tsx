import { useState, useEffect, useCallback } from "react";
import {
  IndianRupee,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Banknote,
  ArrowDownToLine,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "";
const ADMIN_PASSWORD = "increnation2024";
const AUTH_KEY = "admin_authenticated";

interface Transaction {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: string;
  paymentStatus: string;
  txnId: string | null;
  paymentMode: string;
  bankName: string;
  settlementStatus: string;
  settlementRequestedAt: string | null;
  settledAt: string | null;
  createdAt: string;
  completedAt: string;
  resultMsg: string;
}

interface Summary {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  unsettledAmount: number;
  unsettledCount: number;
  settlementRequestedCount: number;
  settledCount: number;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  TXN_SUCCESS: {
    label: "Success",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  TXN_FAILURE: {
    label: "Failed",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  INITIATED: {
    label: "Initiated",
    color: "bg-blue-100 text-blue-700",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
};

const settlementConfig: Record<string, { label: string; color: string }> = {
  unsettled: { label: "Unsettled", color: "bg-orange-100 text-orange-700" },
  settlement_requested: {
    label: "Requested",
    color: "bg-blue-100 text-blue-700",
  },
  settled: { label: "Settled", color: "bg-green-100 text-green-700" },
};

function PasswordGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      onAuthenticated();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card p-8 rounded-xl border w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="text-xl font-heading font-bold text-center mb-1">
          Admin Access
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter password to access the dashboard
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              required
            />
            {error && (
              <p className="text-sm text-destructive">Incorrect password. Please try again.</p>
            )}
          </div>
          <Button type="submit" className="w-full btn-primary-gradient">
            Access Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === "true"
  );
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, txnRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/summary`),
        fetch(
          `${API_URL}/api/admin/transactions${filter !== "all" ? `?status=${filter}` : ""}`
        ),
      ]);
      const summaryData = await summaryRes.json();
      const txnData = await txnRes.json();
      if (summaryData.success) setSummary(summaryData.data);
      if (txnData.success) setTransactions(txnData.data);
    } catch {
      toast.error("Failed to connect to payment server.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [fetchData, authenticated]);

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (checked) next.add(orderId);
      else next.delete(orderId);
      return next;
    });
  };

  const handleSelectAllUnsettled = (checked: boolean) => {
    if (checked) {
      const unsettled = transactions
        .filter(
          (t) =>
            t.paymentStatus === "TXN_SUCCESS" &&
            t.settlementStatus === "unsettled"
        )
        .map((t) => t.orderId);
      setSelectedOrders(new Set(unsettled));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleRequestSettlement = async () => {
    if (selectedOrders.size === 0) {
      toast.error("Select at least one transaction to settle.");
      return;
    }
    setSettling(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/settlement/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: Array.from(selectedOrders) }),
      });
      const data = await res.json();
      if (data.success) {
        const succeeded = data.results.filter(
          (r: { success: boolean }) => r.success
        ).length;
        toast.success(`Settlement requested for ${succeeded} transaction(s).`);
        setSelectedOrders(new Set());
        fetchData();
      } else {
        toast.error(data.message || "Settlement request failed.");
      }
    } catch {
      toast.error("Failed to request settlement.");
    } finally {
      setSettling(false);
    }
  };

  const handleMarkSettled = async () => {
    if (selectedOrders.size === 0) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/settlement/mark-settled`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: Array.from(selectedOrders) }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Marked as settled.");
        setSelectedOrders(new Set());
        fetchData();
      }
    } catch {
      toast.error("Failed to mark as settled.");
    }
  };

  const handleRefreshStatus = async (orderId: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/refresh-status/${orderId}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Status refreshed for ${orderId}`);
        fetchData();
      }
    } catch {
      toast.error("Failed to refresh status.");
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  const unsettledInSelection = transactions.filter(
    (t) =>
      selectedOrders.has(t.orderId) &&
      t.paymentStatus === "TXN_SUCCESS" &&
      t.settlementStatus === "unsettled"
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              Payout Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage transactions and request on-demand settlements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem(AUTH_KEY);
                setAuthenticated(false);
              }}
            >
              Logout
            </Button>
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryCard
              label="Total Revenue"
              value={`₹${summary.totalRevenue.toLocaleString()}`}
              sub={`${summary.successfulPayments} successful`}
              icon={<IndianRupee className="h-5 w-5 text-green-600" />}
              bg="bg-green-50"
            />
            <SummaryCard
              label="Unsettled"
              value={`₹${summary.unsettledAmount.toLocaleString()}`}
              sub={`${summary.unsettledCount} pending payout`}
              icon={<AlertCircle className="h-5 w-5 text-orange-600" />}
              bg="bg-orange-50"
            />
            <SummaryCard
              label="Settlement Requested"
              value={String(summary.settlementRequestedCount)}
              sub="awaiting Paytm"
              icon={<Clock className="h-5 w-5 text-blue-600" />}
              bg="bg-blue-50"
            />
            <SummaryCard
              label="Settled"
              value={String(summary.settledCount)}
              sub="completed payouts"
              icon={<Banknote className="h-5 w-5 text-emerald-600" />}
              bg="bg-emerald-50"
            />
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-card rounded-xl border p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter:</span>
              {[
                { key: "all", label: "All" },
                { key: "successful", label: "Successful" },
                { key: "unsettled", label: "Unsettled" },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={filter === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilter(f.key);
                    setSelectedOrders(new Set());
                  }}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {selectedOrders.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedOrders.size} selected
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkSettled}
                disabled={selectedOrders.size === 0}
                className="gap-1"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Settled
              </Button>
              <Button
                size="sm"
                onClick={handleRequestSettlement}
                disabled={settling || unsettledInSelection.length === 0}
                className="gap-1 btn-primary-gradient"
              >
                {settling ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                )}
                Request Payout
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Banknote className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm">
                Transactions will appear here after customers make payments.
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[auto_1fr_1fr_100px_120px_130px_80px] gap-3 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
                <div className="w-8">
                  <Checkbox
                    checked={
                      unsettledInSelection.length > 0 &&
                      unsettledInSelection.length ===
                        transactions.filter(
                          (t) =>
                            t.paymentStatus === "TXN_SUCCESS" &&
                            t.settlementStatus === "unsettled"
                        ).length
                    }
                    onCheckedChange={(v) =>
                      handleSelectAllUnsettled(v === true)
                    }
                  />
                </div>
                <div>Order / Customer</div>
                <div>Transaction</div>
                <div>Amount</div>
                <div>Payment</div>
                <div>Settlement</div>
                <div>Action</div>
              </div>

              {/* Rows */}
              {transactions.map((txn) => {
                const payStatus =
                  statusConfig[txn.paymentStatus] || statusConfig.INITIATED;
                const settleStatus =
                  settlementConfig[txn.settlementStatus] ||
                  settlementConfig.unsettled;
                const isExpanded = expandedRow === txn.orderId;
                const canSelect =
                  txn.paymentStatus === "TXN_SUCCESS" &&
                  txn.settlementStatus !== "settled";

                return (
                  <div key={txn.orderId} className="border-b last:border-b-0">
                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-[auto_1fr_1fr_100px_120px_130px_80px] gap-3 px-4 py-3 items-center text-sm hover:bg-muted/20">
                      <div className="w-8">
                        {canSelect && (
                          <Checkbox
                            checked={selectedOrders.has(txn.orderId)}
                            onCheckedChange={(v) =>
                              handleSelectOrder(txn.orderId, v === true)
                            }
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-xs truncate">
                          {txn.orderId}
                        </p>
                        <p className="font-medium">{txn.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {txn.customerPhone}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-xs truncate">
                          {txn.txnId || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {txn.paymentMode || "-"}{" "}
                          {txn.bankName ? `/ ${txn.bankName}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.createdAt)}
                        </p>
                      </div>
                      <div className="font-semibold">
                        ₹{parseFloat(txn.amount || "0").toLocaleString()}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${payStatus.color}`}
                        >
                          {payStatus.icon}
                          {payStatus.label}
                        </span>
                      </div>
                      <div>
                        {txn.paymentStatus === "TXN_SUCCESS" && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${settleStatus.color}`}
                          >
                            {settleStatus.label}
                          </span>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRefreshStatus(txn.orderId)}
                          title="Refresh status from Paytm"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div className="md:hidden px-4 py-3">
                      <div
                        className="flex items-start justify-between gap-2 cursor-pointer"
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : txn.orderId)
                        }
                      >
                        <div className="flex items-start gap-2">
                          {canSelect && (
                            <Checkbox
                              checked={selectedOrders.has(txn.orderId)}
                              onCheckedChange={(v) => {
                                v !== undefined &&
                                  handleSelectOrder(txn.orderId, v === true);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {txn.customerName}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                              {txn.orderId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            ₹{parseFloat(txn.amount || "0").toLocaleString()}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${payStatus.color}`}
                        >
                          {payStatus.icon}
                          {payStatus.label}
                        </span>
                        {txn.paymentStatus === "TXN_SUCCESS" && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${settleStatus.color}`}
                          >
                            {settleStatus.label}
                          </span>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t space-y-1 text-xs text-muted-foreground">
                          <p>
                            <strong>Txn ID:</strong> {txn.txnId || "-"}
                          </p>
                          <p>
                            <strong>Phone:</strong> {txn.customerPhone}
                          </p>
                          <p>
                            <strong>Mode:</strong> {txn.paymentMode || "-"}{" "}
                            {txn.bankName ? `/ ${txn.bankName}` : ""}
                          </p>
                          <p>
                            <strong>Date:</strong> {formatDate(txn.createdAt)}
                          </p>
                          {txn.settlementRequestedAt && (
                            <p>
                              <strong>Settlement Requested:</strong>{" "}
                              {formatDate(txn.settlementRequestedAt)}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 gap-1"
                            onClick={() => handleRefreshStatus(txn.orderId)}
                          >
                            <RefreshCw className="h-3 w-3" />
                            Refresh Status
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function SummaryCard({
  label,
  value,
  sub,
  icon,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        </div>
        <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}

export default Admin;
