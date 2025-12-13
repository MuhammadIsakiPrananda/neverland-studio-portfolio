import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  ChevronDown,
  Check,
  User,
} from "lucide-react";
import { SettingsCard } from "@/shared/components";

interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface ModernSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
}

const ModernSelect: React.FC<ModernSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={handleToggle}
        className={`w-full bg-slate-950/50 border ${
          isOpen
            ? "border-amber-500/50 ring-2 ring-amber-500/20"
            : "border-white/10"
        } rounded-xl pl-10 pr-10 py-3 text-white cursor-pointer transition-all flex items-center justify-between group hover:border-amber-500/30`}
      >
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" />
        <span className={selectedOption ? "text-white" : "text-slate-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{
            top: coords.top,
            left: coords.left,
            width: coords.width,
          }}
          className="absolute z-[9999] bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-fade-in"
        >
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <div key={group}>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-950/50 sticky top-0 backdrop-blur-sm">
                {group}
              </div>
              {groupOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    value === option.value
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4" />}
                </div>
              ))}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

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
    bankAccountNumber: "",
    bankAccountName: "",
  });

  const bankOptions = [
    { group: "Bank BUMN", value: "mandiri", label: "Bank Mandiri" },
    { group: "Bank BUMN", value: "bri", label: "Bank Rakyat Indonesia (BRI)" },
    { group: "Bank BUMN", value: "bni", label: "Bank Negara Indonesia (BNI)" },
    { group: "Bank BUMN", value: "btn", label: "Bank Tabungan Negara (BTN)" },
    { group: "Bank Swasta Nasional", value: "bca", label: "Bank Central Asia (BCA)" },
    { group: "Bank Swasta Nasional", value: "cimb", label: "CIMB Niaga" },
    { group: "Bank Swasta Nasional", value: "danamon", label: "Bank Danamon" },
    { group: "Bank Swasta Nasional", value: "permata", label: "Permata Bank" },
    { group: "Bank Swasta Nasional", value: "maybank", label: "Maybank Indonesia" },
    { group: "Bank Swasta Nasional", value: "panin", label: "Panin Bank" },
    { group: "Bank Swasta Nasional", value: "ocbc", label: "OCBC NISP" },
    { group: "Bank Swasta Nasional", value: "uob", label: "UOB Indonesia" },
    { group: "Bank Swasta Nasional", value: "mega", label: "Bank Mega" },
    { group: "Bank Swasta Nasional", value: "bukopin", label: "KB Bukopin" },
    { group: "Bank Swasta Nasional", value: "sinarmas", label: "Bank Sinarmas" },
    { group: "Bank Digital", value: "jago", label: "Bank Jago" },
    { group: "Bank Digital", value: "seabank", label: "SeaBank" },
    { group: "Bank Digital", value: "neo", label: "Bank Neo Commerce" },
    { group: "Bank Digital", value: "jenius_btpn", label: "Jenius / BTPN" },
    { group: "Bank Digital", value: "allo", label: "Allo Bank" },
    { group: "Bank Syariah", value: "bsi", label: "Bank Syariah Indonesia (BSI)" },
    { group: "Bank Syariah", value: "muamalat", label: "Bank Muamalat" },
    { group: "Bank Syariah", value: "bca_syariah", label: "BCA Syariah" },
    { group: "Bank Syariah", value: "cimb_syariah", label: "CIMB Niaga Syariah" },
    { group: "Bank Pembangunan Daerah (BPD)", value: "bjb", label: "Bank BJB" },
    { group: "Bank Pembangunan Daerah (BPD)", value: "dki", label: "Bank DKI" },
    { group: "Bank Pembangunan Daerah (BPD)", value: "jateng", label: "Bank Jateng" },
    { group: "Bank Pembangunan Daerah (BPD)", value: "jatim", label: "Bank Jatim" },
    { group: "Bank Pembangunan Daerah (BPD)", value: "bali", label: "Bank BPD Bali" },
    { group: "Bank Pembangunan Daerah (BPD)", value: "sumut", label: "Bank Sumut" },
  ];

  const walletOptions = [
    { group: "Major E-Wallets", value: "gopay", label: "GoPay" },
    { group: "Major E-Wallets", value: "ovo", label: "OVO" },
    { group: "Major E-Wallets", value: "dana", label: "DANA" },
    { group: "Major E-Wallets", value: "shopeepay", label: "ShopeePay" },
    { group: "Major E-Wallets", value: "linkaja", label: "LinkAja" },
    { group: "Banking Wallets", value: "jenius", label: "Jenius Pay" },
    { group: "Banking Wallets", value: "sakuku", label: "Sakuku (BCA)" },
    { group: "Banking Wallets", value: "octo", label: "OCTO Mobile (CIMB)" },
    { group: "Banking Wallets", value: "jakone", label: "JakOne Mobile" },
    { group: "Other E-Wallets", value: "astrapay", label: "AstraPay" },
    { group: "Other E-Wallets", value: "isaku", label: "i.Saku" },
    { group: "Other E-Wallets", value: "doku", label: "DOKU Wallet" },
    { group: "Other E-Wallets", value: "paytren", label: "Paytren" },
    { group: "Other E-Wallets", value: "spin", label: "SpinPay" },
  ];

  const retailOptions = [
    { group: "Alfamart Group", value: "alfamart", label: "Alfamart" },
    { group: "Alfamart Group", value: "alfamidi", label: "Alfamidi" },
    { group: "Alfamart Group", value: "lawson", label: "Lawson" },
    { group: "Alfamart Group", value: "dandan", label: "Dan+Dan" },
    { group: "Indomaret Group", value: "indomaret", label: "Indomaret" },
    { group: "Other Outlets", value: "pos", label: "Kantor Pos (Pos Indonesia)" },
    { group: "Other Outlets", value: "pegadaian", label: "Pegadaian" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validasi: Hanya angka yang diperbolehkan untuk Nomor Rekening
    if (name === "bankAccountNumber") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

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
              
              {/* Bank Card Visualization */}
              <div className="relative w-full max-w-md mx-auto h-56 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-white/10 overflow-hidden group transition-all hover:scale-[1.02] mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Bank Name</p>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {formData.vaBank ? bankOptions.find(b => b.value === formData.vaBank)?.label : "Select Bank"}
                      </h3>
                    </div>
                    <Banknote className="w-8 h-8 text-amber-500/80" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mb-1">Account Number</p>
                      <p className="text-2xl font-mono text-white tracking-widest">
                        {formData.bankAccountNumber || "•••• •••• ••••"}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mb-1">Account Holder</p>
                        <p className="text-sm font-medium text-white uppercase tracking-wide">
                          {formData.bankAccountName || "Bank Account Name"}
                        </p>
                      </div>
                      <div className="w-12 h-8 bg-amber-500/20 rounded flex items-center justify-center border border-amber-500/30">
                        <div className="w-6 h-4 border border-amber-500/50 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">
                  Select Bank
                </label>
                <div className="mt-1">
                  <ModernSelect
                    options={bankOptions}
                    value={formData.vaBank}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, vaBank: value }))
                    }
                    placeholder="Choose a bank"
                    icon={Banknote}
                  />
                </div>
              </div>
              
              {formData.vaBank && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Account Number
                    </label>
                    <div className="relative mt-1">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 1234567890"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Account Holder Name
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        name="bankAccountName"
                        value={formData.bankAccountName}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {selectedPayment === "e-wallet" && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-md font-semibold text-white mb-2">
                E-Wallet Configuration
              </h4>
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl">
                <img
                  src="/images/QRIS.jpg"
                  alt="QRIS Payment"
                  className="w-full max-w-sm h-auto object-contain"
                />
                <p className="text-slate-900 text-lg font-bold mt-4">Scan QRIS</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">
                  Select Provider
                </label>
                <div className="mt-1">
                  <ModernSelect
                    options={walletOptions}
                    value={formData.walletProvider}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, walletProvider: value }))
                    }
                    placeholder="Choose provider"
                    icon={Wallet}
                  />
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
                <div className="mt-1">
                  <ModernSelect
                    options={retailOptions}
                    value={formData.retailOutlet}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, retailOutlet: value }))
                    }
                    placeholder="Choose outlet"
                    icon={Store}
                  />
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
