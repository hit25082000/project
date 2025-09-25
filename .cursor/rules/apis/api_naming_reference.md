## API Naming Conventions

### File Naming
- API files: `[feature].api.ts`
  - `establishment.api.ts`
  - `user.api.ts`
  - `reservation.api.ts`

### Class Naming
- API classes: `[Feature]Api`
  - `EstablishmentApi`
  - `UserApi`
  - `ReservationApi`

### Method Naming
- Get methods: `get[Resource]`, `get[Resource]ById`
  - `getEstablishments()`, `getEstablishmentById()`
- Action methods: `[action][Resource]`
  - `createEstablishment()`, `updateEstablishment()`, `deleteEstablishment()`
- Special methods: `[action][Resource][By][Field]`
  - `getEstablishmentByName()`, `getUserByEmail()`