import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle, Trash2, Landmark, Wallet } from "lucide-react";
import { SettingsCard, useBillingState } from "@/shared/components";
import { VirtualAccountForm } from "./VirtualAccountForm";

const getCardIcon = (brand: string) => {
  // Di sini Anda bisa menambahkan ikon untuk brand kartu lain (Amex, etc.)
  if (brand.toLowerCase() === "visa")
    return <img src="/visa-logo.svg" alt="Visa" className="w-10" />;
  if (brand.toLowerCase() === "mastercard")
    return <img src="/mastercard-logo.svg" alt="Mastercard" className="w-10" />;
  return <Landmark className="w-8 h-8 text-slate-400" />;
};

export const BillingTabContent: React.FC = () => {
  const {
    paymentMethods,
    billingHistory,
    isAddingVA,
    setIsAddingVA,
    addVirtualAccount,
    setDefaultPaymentMethod,
    deletePaymentMethod,
  } = useBillingState();

  return (
    <div className="space-y-8">
      <SettingsCard
        title="Payment Methods"
        description="Manage your saved payment methods for subscriptions and services."
        footer={
          !isAddingVA && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddingVA(true)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Add Virtual Account</span>
              </button>
            </div>
          )
        }
      >
        <AnimatePresence>
          {isAddingVA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VirtualAccountForm
                onSuccess={(account) => {
                  addVirtualAccount(account);
                  setIsAddingVA(false);
                }}
                onCancel={() => setIsAddingVA(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!isAddingVA && (
          <ul className="space-y-4">
            {paymentMethods.map((pm) => (
              <li
                key={pm.id}
                className="flex items-center justify-between p-4 bg-slate-950/30 border border-white/5 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  {pm.type === "card" ? (
                    getCardIcon(pm.brand)
                  ) : (
                    <Landmark className="w-8 h-8 text-slate-400" />
                  )}
                  {pm.type === "card" ? (
                    <div>
                      <p className="font-semibold text-white">
                        {pm.brand} ending in {pm.last4}
                      </p>
                      <p className="text-sm text-slate-400">
                        Expires {pm.exp_month}/{pm.exp_year}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-white">
                        {pm.brand} Virtual Account
                      </p>
                      <p className="text-sm text-slate-400">
                        Number ending in ••••{pm.last4}
                      </p>
                    </div>
                  )}
                  {pm.isDefault && (
                    <div className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Default
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {!pm.isDefault && (
                    <button
                      onClick={() => setDefaultPaymentMethod(pm.id)}
                      className="text-sm text-indigo-400 hover:underline"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => deletePaymentMethod(pm.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SettingsCard>

      <SettingsCard
        title="Billing History"
        description="Review your past invoices and payments."
      >
        <ul className="divide-y divide-white/5 -mx-6">
          {billingHistory.map((inv) => (
            <li
              key={inv.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-indigo-500/5 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">
                  Invoice #{inv.id.slice(-6)}
                </p>
                <p className="text-sm text-slate-400">Paid on {inv.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-white">{inv.amount}</span>
                <a
                  href={inv.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Download className="w-4 h-4" /> PDF
                </a>
              </div>
            </li>
          ))}
        </ul>
      </SettingsCard>
    </div>
  );
};
