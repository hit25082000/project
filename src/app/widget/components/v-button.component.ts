import { Component, input, output } from '@angular/core';

@Component({
  selector: 'v-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="onClick()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .primary {
        background-color: #007bff;
        color: white;
      }

      .secondary {
        background-color: #6c757d;
        color: white;
      }
    `,
  ],
})
export class VButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input(false);

  click = output<void>();

  buttonClasses(): string {
    return `btn ${this.variant()}`;
  }

  onClick(): void {
    if (!this.disabled()) {
      this.click.emit();
    }
  }
}
