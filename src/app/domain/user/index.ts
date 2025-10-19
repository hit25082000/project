// User API
export { UserApi } from './apis/user.api';

// User Services
export { UserService } from './services/user.service';

// User Pages
export { UserListPage } from './pages/user-list.page/user-list.page';
export { UserEditPage } from './pages/user-edit.page/user-edit.page';

// User Components
export { UserListComponent } from './components/user-list/user-list.component';
export { UserCardComponent } from './components/user-card/user-card.component';
export { UserEditComponent } from './components/user-edit/user-edit.component';

// User Interfaces
export type {
  User,
  UserPreview,
  UserCreate,
  UserUpdate,
  UserDetails,
} from './interfaces/user.interface';

// User Errors (re-exported from global error handler)
export {
  ApiError,
  NotFoundError,
  ValidationError,
} from '@shared/errors/global-error-handler';
