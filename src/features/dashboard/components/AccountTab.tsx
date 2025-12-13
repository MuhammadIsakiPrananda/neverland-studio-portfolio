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
      description: "Supports Visa, Mastercard, JCB. Secure encrypted transaction.",
      icon: <CreditCard className="w-6 h-6 text-slate-400" />,
    },
    {
      id: "virtual-account",
      name: "Virtual Account",
      description: "Instant verification via BCA, Mandiri, BNI, BRI, Permata, CIMB, Danamon, BSI, etc.",
      icon: <Banknote className="w-6 h-6 text-slate-400" />,
    },
    {
      id: "e-wallet",
      name: "E-Wallet / QRIS",
      description: "Scan QR or link GoPay, OVO, DANA, ShopeePay, LinkAja, Jenius, etc.",
      icon: <Wallet className="w-6 h-6 text-slate-400" />,
    },
    {
      id: "retail",
      name: "Retail Outlet",
      description: "Pay cash at Alfamart, Indomaret, Lawson, Dan+Dan.",
      icon: <Store className="w-6 h-6 text-slate-400" />,
    },
  ];

  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [isSaving, setIsSaving] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    vaBank: "",
    walletProvider: "",
    walletNumber: "",
    retailOutlet: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      const fetchedInvoices: any[] = [];
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
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPayment === method.id
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-white/5 bg-slate-950/30 hover:border-amber-500/30 hover:bg-amber-500/5"
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
        <div className="mt-6 border-t border-white/5 pt-6">
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
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
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
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM / YY"
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
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
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedPayment === "virtual-account" && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-md font-semibold text-white mb-2">
                Virtual Account Details
              </h4>
              <div>
                <label className="text-sm font-medium text-slate-400">
                  Select Bank
                </label>
                <div className="relative mt-1">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <select
                    name="vaBank"
                    value={formData.vaBank}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
                  >
                    <option value="" disabled>
                      Choose a bank
                    </option>
                    <option value="bca">BCA Virtual Account</option>
                    <option value="mandiri">Mandiri Virtual Account</option>
                    <option value="bni">BNI Virtual Account</option>
                    <option value="bri">BRI Virtual Account</option>
                    <option value="permata">Permata Virtual Account</option>
                    <option value="cimb">CIMB Niaga Virtual Account</option>
                    <option value="danamon">Danamon Virtual Account</option>
                    <option value="bsi">BSI (Bank Syariah Indonesia)</option>
                    <option value="btn">BTN Virtual Account</option>
                    <option value="maybank">Maybank Virtual Account</option>
                    <option value="mega">Bank Mega Virtual Account</option>
                    <option value="sinarmas">Sinarmas Virtual Account</option>
                    <option value="ocbc">OCBC NISP Virtual Account</option>
                    <option value="panin">Panin Bank Virtual Account</option>
                    <option value="uob">UOB Virtual Account</option>
                    <option value="hana">Hana Bank Virtual Account</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-sm text-amber-200">
                  A virtual account number will be generated for you after saving.
                  You can use this number to pay via ATM, Mobile Banking, or
                  Internet Banking.
                </p>
              </div>
            </div>
          )}
          {selectedPayment === "e-wallet" && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-md font-semibold text-white mb-2">
                E-Wallet Configuration
              </h4>
              <div>
                <label className="text-sm font-medium text-slate-400">
                  Select Provider
                </label>
                <div className="relative mt-1">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <select
                    name="walletProvider"
                    value={formData.walletProvider}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
                  >
                    <option value="" disabled>
                      Choose provider
                    </option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                    <option value="shopeepay">ShopeePay</option>
                    <option value="linkaja">LinkAja</option>
                    <option value="jenius">Jenius Pay</option>
                    <option value="astrapay">AstraPay</option>
                    <option value="isaku">i.Saku</option>
                    <option value="sakuku">Sakuku</option>
                    <option value="doku">Doku Wallet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="walletNumber"
                  value={formData.walletNumber}
                  onChange={handleInputChange}
                  placeholder="08xx xxxx xxxx"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors text-slate-200"
                />
              </div>
            </div>
          )}
          {selectedPayment === "retail" && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-md font-semibold text-white mb-2">
                Retail Outlet Payment
              </h4>
              <div>
                <label className="text-sm font-medium text-slate-400">
                  Select Outlet
                </label>
                <div className="relative mt-1">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <select
                    name="retailOutlet"
                    value={formData.retailOutlet}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
                  >
                    <option value="" disabled>
                      Choose outlet
                    </option>
                    <option value="alfamart">Alfamart Group (Alfamart, Alfamidi, Lawson, Dan+Dan)</option>
                    <option value="indomaret">Indomaret</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 border border-white/10 rounded-xl">
                <p className="text-sm text-slate-300">
                  Show the payment code to the cashier to complete your
                  transaction. The code will be valid for 24 hours.
                </p>
              </div>
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
            <tr className="border-b border-white/5 text-sm text-slate-400">
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
                  className="border-b border-white/5 last:border-b-0"
                >
                  <td className="p-3">
                    <div className="h-4 bg-slate-800/50 rounded animate-pulse w-3/4"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-800/50 rounded animate-pulse w-1/2"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-800/50 rounded animate-pulse w-1/4"></div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="h-6 w-6 bg-slate-800/50 rounded-full animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : invoices.length > 0 ? (
              // Actual Data
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-white/5 text-sm last:border-b-0 hover:bg-amber-500/5 transition-colors"
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
