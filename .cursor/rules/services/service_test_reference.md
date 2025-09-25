See also `testing_patterns.mdc` for global guidelines.

## Service Testing Patterns

### Unit Tests
```typescript
describe('EstablishmentService', () => {
  let service: EstablishmentService;
  let mockApi: jasmine.SpyObj<EstablishmentApi>;
  
  beforeEach(() => {
    mockApi = jasmine.createSpyObj('EstablishmentApi', ['getList', 'getDetailsById']);
    TestBed.configureTestingModule({
      providers: [
        EstablishmentService,
        { provide: EstablishmentApi, useValue: mockApi }
      ]
    });
    service = TestBed.inject(EstablishmentService);
  });
  
  it('should select establishment and load details', async () => {
    const mockEstablishment = { id: '1', name: 'Test' };
    mockApi.getDetailsById.and.returnValue(Promise.resolve(mockEstablishment));
    
    service.selectById('1');
    
    expect(service.selectedId()).toBe('1');
    // Wait for async operations
    await fixture.whenStable();
    expect(service.selectedItem()).toEqual(mockEstablishment);
  });
});
```