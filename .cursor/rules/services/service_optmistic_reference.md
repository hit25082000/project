Use together with `service_patterns.mdc` to keep state and user feedback consistent.

## Advanced Service Patterns

### Optimistic Updates
```typescript
async updateWithOptimisticUpdate(id: string, update: iEstablishmentUpdate): Promise<void> {
  // Store current state for rollback
  const currentItem = this.selectedItem();
  if (!currentItem) return;
  
  // Apply optimistic update
  const optimisticItem = { ...currentItem, ...update };
  this.selectedItem.set(optimisticItem);
  
  try {
    await this.api.update(id, update);
    // Refresh to get server state
    this.detailsResource.refetch();
  } catch (error) {
    // Rollback on error
    this.selectedItem.set(currentItem);
    throw error;
  }
}
```

