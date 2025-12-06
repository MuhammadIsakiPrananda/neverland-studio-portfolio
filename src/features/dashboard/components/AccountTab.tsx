import React, { useState, useEffect } from "react";
import {
  Download,
  CreditCard,
  Banknote,
  Wallet,
  Store,
  Save,
  Loader,
  Calendar,
  Lock,
  RefreshCw,
} from "lucide-react";
import { SettingsCard } from "@/shared/components";

export const AccountTabContent: React.FC = () => {
  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-6 h-6 text-slate-400" />,
    },
    {
      id: "virtual-account",
      name: "Virtual Account",
      description: "BCA, Mandiri, BNI, etc.",
      icon: <Banknote className="w-6 h-6 text-slate-400" />,
    },
    {
      id: "e-wallet",
      name: "E-Wallet",
      description: "GoPay, OVO, DANA",
      icon: <Wallet className="w-6 h-6 text-slate-400" />,
    },
    {
      id: "retail",
      name: "Retail Outlet",
      description: "Alfamart, Indomaret",
      icon: <Store className="w-6 h-6 text-slate-400" />,
    },
  ];

  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [isSaving, setIsSaving] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const handleSavePayment = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Di sini Anda bisa menambahkan notifikasi sukses
      // addNotification('Payment Method Updated', 'Your payment method has been saved.', 'success');
    }, 1500);
  };

  const fetchInvoices = () => {
    setIsHistoryLoading(true);
    // Simulate fetching data from an API
    setTimeout(() => {
      const fetchedInvoices = [
        {
          id: "INV-2024-003",
          date: "May 1, 2024",
          amount: "$25.00",
          status: "Paid",
        },
        {
          id: "INV-2024-002",
          date: "April 1, 2024",
          amount: "$25.00",
          status: "Paid",
        },
        {
          id: "INV-2024-001",
          date: "March 1, 2024",
          amount: "$25.00",
          status: "Paid",
        },
      ];
      setInvoices(fetchedInvoices);
      setIsHistoryLoading(false);
    }, 1200);
  };

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-8">
      <SettingsCard
        title="Payment Method"
        description="Select your preferred payment method for your subscription."
        footer={
          <div className="flex justify-end">
            <button
              onClick={handleSavePayment}
              disabled={isSaving}
              className="flex items-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {isSaving ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPayment === method.id
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={() => setSelectedPayment(method.id)}
                className="hidden"
              />
              {method.icon}
              <div>
                <p className="font-semibold text-white">{method.name}</p>
                {method.description && (
                  <p className="text-xs text-slate-400">{method.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* --- FORMULIR DINAMIS DITAMBAHKAN DI SINI --- */}
        <div className="mt-6 border-t border-slate-800 pt-6">
          {selectedPayment === "credit-card" && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-md font-semibold text-white mb-2">
                Enter Card Details
              </h4>
              <div>
                <label className="text-sm font-medium text-slate-400">
                  Card Number
                </label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-400">
                    Expiry Date
                  </label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">
                    CVV
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedPayment !== "credit-card" && (
            <div className="text-center text-slate-400 p-4 bg-slate-800/50 rounded-lg animate-fade-in">
              <p>
                Payment details and instructions will be provided upon saving
                changes.
              </p>
            </div>
          )}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Billing History"
        description="Download your past invoices for your records."
        headerActions={
          <button
            onClick={fetchInvoices}
            disabled={isHistoryLoading}
            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            <RefreshCw
              className={`w-4 h-4 ${isHistoryLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        }
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-sm text-slate-400">
              <th className="p-3 font-medium">Invoice</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {isHistoryLoading ? (
              // Skeleton Loader
              [...Array(3)].map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800 last:border-b-0"
                >
                  <td className="p-3">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-1/2"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-1/4"></div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="h-6 w-6 bg-slate-700/50 rounded-full animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : invoices.length > 0 ? (
              // Actual Data
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-slate-800 text-sm last:border-b-0 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-3 text-slate-200 font-medium">
                    {invoice.id}
                  </td>
                  <td className="p-3">{invoice.date}</td>
                  <td className="p-3">{invoice.amount}</td>
                  <td className="p-3 text-right">
                    <button className="p-2 text-slate-400 hover:text-amber-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={4} className="text-center p-8 text-slate-500">
                  No billing history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </SettingsCard>
    </div>
  );
};
