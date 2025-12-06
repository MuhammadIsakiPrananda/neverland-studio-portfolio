import { useState } from 'react';

interface CardPaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault: boolean;
}

interface VAPaymentMethod {
  id: string;
  type: 'va';
  brand: string; // Menggunakan 'brand' agar konsisten
  last4: string; // Menggunakan 'last4' agar konsisten
  isDefault: boolean;
}

type PaymentMethod = CardPaymentMethod | VAPaymentMethod;

const initialPaymentMethods: PaymentMethod[] = [
  { id: 'pm_1', type: 'card', brand: 'Visa', last4: '4242', exp_month: 12, exp_year: 2025, isDefault: true },
  { id: 'pm_2', type: 'card', brand: 'Mastercard', last4: '5555', exp_month: 8, exp_year: 2024, isDefault: false },
];

const initialBillingHistory = [
  { id: 'inv_1', date: 'May 1, 2024', amount: '$25.00', status: 'Paid', pdfUrl: '#' },
  { id: 'inv_2', date: 'April 1, 2024', amount: '$25.00', status: 'Paid', pdfUrl: '#' },
  { id: 'inv_3', date: 'March 1, 2024', amount: '$25.00', status: 'Paid', pdfUrl: '#' },
];

export const useBillingState = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [billingHistory] = useState(initialBillingHistory);
  const [isAddingVA, setIsAddingVA] = useState(false);

  // Fungsi untuk menambahkan Virtual Account
  const addVirtualAccount = (account: { bank: string; number: string }) => {
    const newVA: VAPaymentMethod = {
      id: `va_${Date.now()}`,
      type: 'va',
      brand: account.bank,
      last4: account.number.slice(-4),
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods(prev => [...prev, newVA]);
  };

  // Fungsi untuk mengatur kartu default
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({ ...pm, isDefault: pm.id === id }))
    );
  };

  // Fungsi untuk menghapus kartu
  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => {
      const remaining = prev.filter(pm => pm.id !== id);
      // Jika kartu default dihapus, jadikan kartu pertama sebagai default baru
      if (remaining.length > 0 && !remaining.some(pm => pm.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  return { paymentMethods, billingHistory, isAddingVA, setIsAddingVA, addVirtualAccount, setDefaultPaymentMethod, deletePaymentMethod };
};