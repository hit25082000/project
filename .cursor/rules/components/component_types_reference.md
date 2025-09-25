# Component Types Reference

Components follow a strict separation between smart page components and dumb reusable components to maintain clear responsibilities and improve testability.

## Page Components (`.page.ts`) – Smart Components

Smart components handle business logic, state management, and orchestration.

### Rules
1. Inject **services** only; never inject APIs directly.
2. Bind service signals straight to the template for rendering.
3. Listen to child component outputs and call service methods.
4. Own routing, navigation, and flow control.
5. Manage form submissions and user interactions.

### Example
```typescript
// establishment-details.page.ts
@Component({
  selector: 'app-establishment-details',
  templateUrl: './establishment-details.page.html',
  styleUrls: ['./establishment-details.page.scss']
})
export class EstablishmentDetailsPage {
  private establishmentService = inject(EstablishmentService);
  private router = inject(Router);

  establishment = this.establishmentService.selectedItem;
  isLoading = this.establishmentService.isLoading;

  onEstablishmentSelect(id: string): void {
    this.establishmentService.selectById(id);
  }

  onEdit(establishment: iEstablishment): void {
    this.router.navigate(['/establishments', establishment.id, 'edit']);
  }

  onDelete(establishment: iEstablishment): void {
    this.establishmentService.deleteById(establishment.id);
  }
}
```

## Reusable Components (`.component.ts`) – Dumb Components

Dumb components are presentational and focused on a single responsibility.

### Rules
1. Never inject services or APIs.
2. Receive data using `input()`.
3. Communicate events using `output()`.
4. Prefer `model()` for simple two-way bindings.
5. Use Angular control flow (`@if`, `@for`, `@switch`).

### Example
```typescript
// establishment-card.component.ts
@Component({
  selector: 'v-establishment-card',
  templateUrl: './establishment-card.component.html',
  styleUrls: ['./establishment-card.component.scss']
})
export class EstablishmentCardComponent {
  establishment = input.required<iEstablishmentPreview>();

  select = output<string>();
  edit = output<string>();
  delete = output<string>();

  onSelect(): void {
    this.select.emit(this.establishment().id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.establishment().id);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.establishment().id);
  }
}
```