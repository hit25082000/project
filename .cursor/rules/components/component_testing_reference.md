# Component Testing Reference

Align component tests with the smart vs. dumb separation to maximize coverage and simplicity.

## Smart Component Tests (Page Components)
- Validate interactions with injected services.
- Verify routing and navigation behaviors.
- Assert state management via signals and derived selectors.
- Mock child components to isolate container logic.

## Dumb Component Tests (Reusable Components)
- Verify inputs drive rendering correctly.
- Assert outputs emit expected payloads on user interaction.
- Test template logic using Angular control flow (`@if`, `@for`, `@switch`).
- Avoid service mocking; components must remain presentation-only.