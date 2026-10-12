import { PasswordPolicyConfig, PasswordValidationResult } from '../types/inventory';

export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 8,
  maxLength: 32,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  allowedSpecialChars: '@$!%*?&#_#^~()+-=',
};

export function validatePassword(
  password: string,
  policy: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY
): PasswordValidationResult {
  const errors: string[] = [];

  const lengthValid =
    password.length >= policy.minLength && password.length <= policy.maxLength;
  if (!lengthValid) {
    errors.push(
      `Password must be between ${policy.minLength} and ${policy.maxLength} characters.`
    );
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z).');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z).');
  }

  if (policy.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9).');
  }

  const escapedChars = policy.allowedSpecialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const specialRegex = new RegExp(`[${escapedChars}]`);
  if (policy.requireSpecialChar && !specialRegex.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&#).');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
