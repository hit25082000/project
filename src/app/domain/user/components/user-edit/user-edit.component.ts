import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserUpdate } from '../../interfaces/user.interface';
import {
  USER_EDIT_FORM_CONFIG,
  DynamicFormConfig,
} from './user-edit-form.config';

@Component({
  selector: 'v-user-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent {
  // Inputs
  user = input.required<User>();

  // Outputs
  save = output<UserUpdate>();
  cancel = output<void>();

  // Form configuration
  formConfig = USER_EDIT_FORM_CONFIG();

  // Computed form data for dynamic form
  formData = computed(() => {
    const user = this.user();
    return {
      name: user.name,
      avatar_url: user.avatar_url || '',
    };
  });

  // Local form state
  private localFormData = this.formData();

  // Event handlers
  updateFormData(fieldName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.localFormData = {
      ...this.localFormData,
      [fieldName]: target.value,
    };
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
    const updateData: UserUpdate = {
      name: this.localFormData.name,
      avatar_url: this.localFormData.avatar_url || undefined,
    };
    this.save.emit(updateData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
