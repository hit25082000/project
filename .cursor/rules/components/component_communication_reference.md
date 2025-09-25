# Component Communication Reference

Follow these patterns to coordinate data flow between components.

## Parent to Child (Input)
```typescript
// Parent template
<v-child-component [data]="parentData" />

// Child component
@Component({
  selector: 'v-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.scss'],
})
export class ChildComponent {
  data = input.required<DataType>();
}
```

## Child to Parent (Output)
```typescript
// Child component
@Component({
  selector: 'v-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.scss'],
})
export class ChildComponent {
  action = output<DataType>();

  triggerAction(data: DataType): void {
    this.action.emit(data);
  }
}

// Parent template
<v-child-component (action)="handleAction($event)" />
```

## Two-way Binding (Model)
```typescript
// Child component
@Component({
  selector: 'v-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.scss'],
})
export class ChildComponent {
  value = model<DataType>();
}

// Parent template
<v-child-component [(value)]="parentValue" />
```