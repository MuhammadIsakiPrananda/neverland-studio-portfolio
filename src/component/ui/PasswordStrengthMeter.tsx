import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
}

const PasswordCriteria: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
  <div className={`flex items-center gap-2 transition-colors duration-300 ${isValid ? 'text-green-400' : 'text-slate-500'}`}>
    {isValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
    <span className="text-xs">{text}</span>
  </div>
);

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const criteria = useMemo(() => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const strength = Object.values(criteria).filter(Boolean).length;

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
  ];
  
  const strengthColor = strength > 0 ? strengthColors[strength - 1] : 'bg-slate-700';

  return (
    <div className={`mt-3 space-y-3 transition-all duration-300 ${password ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
      {/* Strength Bar */}
      <div className="h-1.5 w-full bg-slate-700 rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${strength * 20}%` }}
        />
      </div>

      {/* Criteria List */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <PasswordCriteria isValid={criteria.length} text="At least 8 characters" />
        <PasswordCriteria isValid={criteria.uppercase} text="One uppercase letter" />
        <PasswordCriteria isValid={criteria.lowercase} text="One lowercase letter" />
        <PasswordCriteria isValid={criteria.number} text="One number" />
        <PasswordCriteria isValid={criteria.special} text="One special character" />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;