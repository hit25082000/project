## Service Naming Conventions

### File Naming
- Service files: `[feature].service.ts`
  - `establishment.service.ts`
  - `user.service.ts`
  - `notification.service.ts`

### Class Naming
- Service classes: `[Feature]Service`
  - `EstablishmentService`
  - `UserService`
  - `NotificationService`

### Method Naming
- Get methods: `get[Resource]`, `get[Resource]ById`
  - `getEstablishments()`, `getEstablishmentById()`
- Action methods: `[action][Resource]`
  - `createEstablishment()`, `updateEstablishment()`, `deleteEstablishment()`
- State methods: `[action]State`
  - `selectById()`, `clearSelection()`, `setSearchTerm()`
