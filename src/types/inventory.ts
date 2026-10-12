export type AssetCategory =
  | 'Laptop'
  | 'CPU'
  | 'Printer'
  | 'Server'
  | 'Network'
  | 'Monitor'
  | 'Tablet'
  | 'Scanner';

export type AssetStatus = 'In Store' | 'In Use' | 'Maintenance' | 'Decommissioned';

export interface Asset {
  id: number;
  serial_number: string;
  model: string;
  brand: string;
  category: AssetCategory;
  status: AssetStatus;
  assigned_to?: string;
  location?: string;
  date_added: string;
  notes?: string;
}

export interface PasswordPolicyConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  allowedSpecialChars: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}
