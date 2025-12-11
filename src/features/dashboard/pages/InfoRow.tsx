// src/pages/dashboard/InfoRow.tsx

export const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <p className="flex justify-between items-center">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-white">{value}</span>
  </p>
);