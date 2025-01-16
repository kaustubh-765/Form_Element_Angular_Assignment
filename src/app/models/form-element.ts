export interface FormField {
  name: string;
  type: 'text' | 'radio' | 'email' | 'dropdown' | 'checkbox' | 'file' | 'number';
  required: boolean;
  label: string;
  options?: string[];
}