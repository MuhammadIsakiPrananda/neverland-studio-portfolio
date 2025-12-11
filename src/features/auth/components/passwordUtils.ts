export const passwordCriteriaChecks = {
  length: (p: string) => p.length >= 8,
  lowercase: (p: string) => /[a-z]/.test(p),
  uppercase: (p: string) => /[A-Z]/.test(p),
  number: (p: string) => /[0-9]/.test(p),
  special: (p: string) => /[^A-Za-z0-9]/.test(p), // Regex ini lebih kuat
};

export const getPasswordStrength = (password: string) => {
  return {
    length: passwordCriteriaChecks.length(password),
    lowercase: passwordCriteriaChecks.lowercase(password),
    uppercase: passwordCriteriaChecks.uppercase(password),
    number: passwordCriteriaChecks.number(password),
    special: passwordCriteriaChecks.special(password),
  };
};

export const isPasswordValid = (password: string): boolean => {
  const checks = getPasswordStrength(password);
  return Object.values(checks).every(Boolean);
};