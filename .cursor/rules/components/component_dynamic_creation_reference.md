# Component Dynamic Creation Reference

Angular 20 introduces enhanced APIs for dynamic component creation. Use the patterns below when rendering components dynamically.

## Enhanced `ViewContainerRef.createComponent`
```typescript
@Component({
  selector: 'v-dynamic-component-host',
  template: `
    <div class="dynamic-component-container">
      <ng-container #dynamicContainer></ng-container>
    </div>
  `,
})
export class DynamicComponentHost {
  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  async loadDynamicComponent(componentType: any, inputs?: any, directives?: any[]): Promise<void> {
    this.container.clear();

    this.componentRef = this.container.createComponent(componentType, {
      inputs,
      directives,
    });

    if (inputs) {
      Object.keys(inputs).forEach(key => {
        this.componentRef.setInput(key, inputs[key]);
      });
    }
  }

  updateComponentInputs(inputs: any): void {
    if (!this.componentRef) {
      return;
    }

    Object.keys(inputs).forEach(key => {
      this.componentRef.setInput(key, inputs[key]);
    });
  }

  destroyDynamicComponent(): void {
    this.componentRef?.destroy();
  }
}
```

## Dynamic Component Factory Service
```typescript
@Injectable({ providedIn: 'root' })
export class DynamicComponentService {
  private componentRegistry = new Map<string, Type<any>>();

  registerComponent(key: string, component: Type<any>): void {
    this.componentRegistry.set(key, component);
  }

  getComponent(key: string): Type<any> | undefined {
    return this.componentRegistry.get(key);
  }

  async loadComponentAsync(
    container: ViewContainerRef,
    componentKey: string,
    inputs?: any,
  ): Promise<ComponentRef<any>> {
    const componentType = this.getComponent(componentKey);
    if (!componentType) {
      throw new Error(`Component '${componentKey}' not found`);
    }

    container.clear();

    const componentRef = container.createComponent(componentType, { inputs });

    return componentRef;
  }
}
```