# Component Structure Reference

Use this guide to organize component decorators, templates, and classes consistently across the project.

## Template and Style Extraction
- Keep inline `template` and `styles` blocks at or below five lines.
- Move longer content to dedicated files named `component-name.component.html` and `component-name.component.scss`.
- Reference extracted files via `templateUrl` and `styleUrls` arrays.

## Template Organization Pattern
```typescript
@Component({
  selector: 'v-feature-example',
  template: `
    <!-- Header Section -->
    <header class="component-header">
      <h1>{{ title() }}</h1>
    </header>

    <!-- Main Content -->
    <main class="component-content">
      @if (isLoading()) {
        <v-loading-spinner />
      } @else {
        <!-- Content here -->
      }
    </main>

    <!-- Footer/Actions -->
    <footer class="component-actions">
      <!-- Action buttons -->
    </footer>
  `,
})
```

## Component Class Organization
```typescript
export class ComponentName {
  // 1. Dependencies (inject)
  private service = inject(SomeService);

  // 2. Inputs
  data = input.required<DataType>();

  // 3. Outputs
  action = output<DataType>();

  // 4. Computed signals
  processedData = computed(() => this.processData(this.data()));

  // 5. Event handlers
  onAction(data: DataType): void {
    this.action.emit(data);
  }

  // 6. Private methods
  private processData(data: DataType): ProcessedDataType {
    // Implementation
  }
}
```