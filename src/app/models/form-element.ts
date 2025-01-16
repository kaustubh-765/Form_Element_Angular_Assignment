export interface FormElement {
  id: string;
  name: string;
  type: 'text' | 'radio' | 'email' | 'dropdown' | 'checkbox' | 'file' | 'number';
  required: boolean;
  label: string;
  options?: string[];  // For radio and checkbox
  fileData?: {
    filename: string;
    content: string;
    contentType: string;
  };
}