# API Testing Reference

Detailed examples and patterns for testing API layers with Supabase integration.

## Table of Contents

1. [Basic Unit Test Setup](#basic-unit-test-setup)
2. [Successful Data Fetching Tests](#successful-data-fetching-tests)
3. [Error Handling Tests](#error-handling-tests)
4. [CRUD Operation Tests](#crud-operation-tests)
5. [Pagination and Filtering Tests](#pagination-and-filtering-tests)
6. [Helper Functions](#helper-functions)
7. [Advanced Patterns](#advanced-patterns)

---

## Basic Unit Test Setup

### Complete Supabase Mock Setup
```typescript
describe('FeatureApi', () => {
  let api: FeatureApi;
  let mockSupabase: jasmine.SpyObj<SupabaseClient>;
  
  beforeEach(() => {
    // Create comprehensive Supabase mock
    mockSupabase = jasmine.createSpyObj('SupabaseClient', [
      'from', 'select', 'insert', 'update', 'delete'
    ]);
    
    TestBed.configureTestingModule({
      providers: [
        FeatureApi,
        { provide: SupabaseClient, useValue: mockSupabase }
      ]
    });
    
    api = TestBed.inject(FeatureApi);
  });
});
```

---

## Successful Data Fetching Tests

### List Fetching Test
```typescript
it('should fetch feature list successfully', async () => {
  // Arrange
  const mockData = [
    { id: '1', name: 'Feature 1', created_at: '2024-01-01' },
    { id: '2', name: 'Feature 2', created_at: '2024-01-02' }
  ];
  
  const mockQuery = createMockQuery({ data: mockData, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.getList();
  
  // Assert
  expect(result).toEqual(mockData);
  expect(mockSupabase.from).toHaveBeenCalledWith('features');
  expect(mockQuery.select).toHaveBeenCalledWith('*');
  expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
});
```

### Detail Fetching with Relations
```typescript
it('should fetch feature by id with relations', async () => {
  // Arrange
  const mockFeature = {
    id: '1',
    name: 'Test Feature',
    relations: [{ id: '1', name: 'Relation 1' }]
  };
  
  const mockQuery = createMockQuery({ data: mockFeature, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.getDetailsById('1');
  
  // Assert
  expect(result).toEqual(mockFeature);
  expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
  expect(mockQuery.single).toHaveBeenCalled();
});
```

---

## Error Handling Tests

### Database Error Handling
```typescript
it('should handle database errors gracefully', async () => {
  // Arrange
  const mockError = { 
    code: 'PGRST301', 
    message: 'Database connection failed',
    status: 500 
  };
  
  const mockQuery = createMockQuery({ data: null, error: mockError });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act & Assert
  await expectAsync(api.getList()).toBeRejectedWithError('Database connection failed');
});
```

### Not Found Error Handling
```typescript
it('should return null for not found items', async () => {
  // Arrange
  const notFoundError = { code: 'PGRST116', message: 'No rows found' };
  const mockQuery = createMockQuery({ data: null, error: notFoundError });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.getDetailsById('nonexistent');
  
  // Assert
  expect(result).toBeNull();
});
```

---

## CRUD Operation Tests

### Create Operation Test
```typescript
it('should create feature successfully', async () => {
  // Arrange
  const newFeature = { name: 'New Feature', description: 'Test description' };
  const createdFeature = { id: '1', ...newFeature, created_at: '2024-01-01' };
  
  const mockQuery = createMockQuery({ data: createdFeature, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.create(newFeature);
  
  // Assert
  expect(result).toEqual(createdFeature);
  expect(mockQuery.insert).toHaveBeenCalledWith(newFeature);
  expect(mockQuery.select).toHaveBeenCalled();
  expect(mockQuery.single).toHaveBeenCalled();
});
```

### Update Operation Test
```typescript
it('should update feature successfully', async () => {
  // Arrange
  const updateData = { name: 'Updated Feature' };
  const updatedFeature = { id: '1', ...updateData, updated_at: '2024-01-01' };
  
  const mockQuery = createMockQuery({ data: updatedFeature, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.update('1', updateData);
  
  // Assert
  expect(result).toEqual(updatedFeature);
  expect(mockQuery.update).toHaveBeenCalledWith(updateData);
  expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
});
```

### Delete Operation Test
```typescript
it('should delete feature successfully', async () => {
  // Arrange
  const mockQuery = createMockQuery({ data: null, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  await api.delete('1');
  
  // Assert
  expect(mockQuery.delete).toHaveBeenCalled();
  expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
});
```

---

## Pagination and Filtering Tests

### Pagination Test
```typescript
it('should handle pagination correctly', async () => {
  // Arrange
  const mockPaginatedData = {
    data: [{ id: '1', name: 'Feature 1' }],
    pagination: { page: 1, pageSize: 10, totalItems: 25, totalPages: 3 }
  };
  
  const mockQuery = createMockQuery({ 
    data: mockPaginatedData.data, 
    error: null, 
    count: 25 
  });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.getListPaginated(1, 10);
  
  // Assert
  expect(result.data).toEqual(mockPaginatedData.data);
  expect(result.pagination.totalItems).toBe(25);
  expect(mockQuery.range).toHaveBeenCalledWith(0, 9);
});
```

### Search Filter Test
```typescript
it('should apply search filters correctly', async () => {
  // Arrange
  const mockData = [{ id: '1', name: 'Search Result' }];
  const mockQuery = createMockQuery({ data: mockData, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.getList('search term');
  
  // Assert
  expect(result).toEqual(mockData);
  expect(mockQuery.ilike).toHaveBeenCalledWith('name', '%search term%');
});
```

---

## Helper Functions

### Mock Query Creator
```typescript
// Reusable mock query creator
function createMockQuery(response: { data: any; error: any; count?: number }) {
  const mockQuery = {
    select: jasmine.createSpy('select').and.returnThis(),
    insert: jasmine.createSpy('insert').and.returnThis(),
    update: jasmine.createSpy('update').and.returnThis(),
    delete: jasmine.createSpy('delete').and.returnThis(),
    eq: jasmine.createSpy('eq').and.returnThis(),
    ilike: jasmine.createSpy('ilike').and.returnThis(),
    order: jasmine.createSpy('order').and.returnThis(),
    range: jasmine.createSpy('range').and.returnThis(),
    single: jasmine.createSpy('single').and.returnValue(
      Promise.resolve(response)
    ),
    then: (callback: Function) => callback(response)
  };
  
  return mockQuery;
}
```

### Custom Matchers
```typescript
// Custom matchers for API testing
beforeEach(() => {
  jasmine.addMatchers({
    toBeApiError: () => ({
      compare: (actual: any, expectedMessage?: string) => {
        const isApiError = actual instanceof ApiError;
        const messageMatches = !expectedMessage || actual.message.includes(expectedMessage);
        
        return {
          pass: isApiError && messageMatches,
          message: `Expected ${actual} to be an ApiError${expectedMessage ? ` with message containing "${expectedMessage}"` : ''}`
        };
      }
    })
  });
});
```

### Test Data Factories
```typescript
// Test data factory functions
export function createMockFeature(overrides: Partial<Feature> = {}): Feature {
  return {
    id: '1',
    name: 'Test Feature',
    description: 'Test description',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  };
}

export function createMockFeatureList(count: number = 3): Feature[] {
  return Array.from({ length: count }, (_, index) => 
    createMockFeature({ 
      id: `${index + 1}`, 
      name: `Feature ${index + 1}` 
    })
  );
}
```

---

## Advanced Patterns

### Complex Query Testing
```typescript
it('should handle complex queries with multiple relations', async () => {
  // Arrange
  const mockComplexData = {
    id: '1',
    name: 'Complex Feature',
    relations: [
      { id: '1', name: 'Relation 1', subRelations: [{ id: '1', name: 'Sub 1' }] }
    ],
    metadata: { tags: ['tag1', 'tag2'] }
  };
  
  const mockQuery = createMockQuery({ data: mockComplexData, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.getComplexDetails('1');
  
  // Assert
  expect(result).toEqual(mockComplexData);
  expect(mockQuery.select).toHaveBeenCalledWith(`
    *,
    relations:relations (
      *,
      subRelations:sub_relations (*)
    ),
    metadata:feature_metadata (*)
  `);
});
```

### Batch Operation Testing
```typescript
it('should handle batch operations correctly', async () => {
  // Arrange
  const batchData = [
    { name: 'Feature 1' },
    { name: 'Feature 2' },
    { name: 'Feature 3' }
  ];
  
  const mockQuery = createMockQuery({ 
    data: batchData.map((item, index) => ({ id: `${index + 1}`, ...item })), 
    error: null 
  });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.createBatch(batchData);
  
  // Assert
  expect(result).toHaveLength(3);
  expect(mockQuery.insert).toHaveBeenCalledWith(batchData);
});
```

### Transaction Testing
```typescript
it('should handle transaction operations', async () => {
  // Arrange
  const transactionData = {
    feature: { name: 'Transaction Feature' },
    relations: [{ name: 'Relation 1' }]
  };
  
  const mockQuery = createMockQuery({ data: transactionData, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const result = await api.createWithRelations(transactionData);
  
  // Assert
  expect(result).toEqual(transactionData);
  expect(mockQuery.insert).toHaveBeenCalledWith(transactionData);
});
```

### Performance Testing
```typescript
it('should handle large datasets efficiently', async () => {
  // Arrange
  const largeDataset = createMockFeatureList(1000);
  const mockQuery = createMockQuery({ data: largeDataset, error: null });
  mockSupabase.from.and.returnValue(mockQuery);
  
  // Act
  const startTime = performance.now();
  const result = await api.getLargeDataset();
  const endTime = performance.now();
  
  // Assert
  expect(result).toHaveLength(1000);
  expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
});
```

---

## Testing Best Practices Summary

1. **Mock the entire query chain**: Ensure all Supabase methods are properly mocked
2. **Test both success and error paths**: Cover all possible API responses
3. **Use realistic test data**: Create fixtures that match your actual data structure
4. **Verify query construction**: Assert that correct parameters are passed to Supabase
5. **Test edge cases**: Empty results, network failures, validation errors
6. **Use custom matchers**: Create reusable assertions for common patterns
7. **Performance considerations**: Test with realistic data sizes
8. **Transaction testing**: Verify complex operations work correctly

---

*This reference document provides comprehensive examples for testing API layers. Use these patterns as templates and adapt them to your specific use cases.*
