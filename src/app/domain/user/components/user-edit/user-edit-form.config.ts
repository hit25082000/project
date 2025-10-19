import { Validators } from '@angular/forms';

export interface DynamicFormConfig {
  label: string;
  name: string;
  type: { field: 'input' | 'textarea' | 'select' };
  validations: any[];
  placeholder?: string;
  required?: boolean;
}

export const USER_EDIT_FORM_CONFIG = (): DynamicFormConfig[] => [
  {
    label: 'Name',
    name: 'name',
    type: { field: 'input' },
    validations: [Validators.required, Validators.minLength(2)],
    placeholder: 'Enter user name',
    required: true,
  },
  {
    label: 'Avatar URL',
    name: 'avatar_url',
    type: { field: 'input' },
    validations: [],
    placeholder: 'https://example.com/avatar.jpg',
  },
];
