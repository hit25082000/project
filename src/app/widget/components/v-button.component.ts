import { Component, input, output } from '@angular/core';

@Component({
  selector: 'v-button',
  standalone: true,
  templateUrl: './v-button.component.html',
  styleUrl: './v-button.component.scss',
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
