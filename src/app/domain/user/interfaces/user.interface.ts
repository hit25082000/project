export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreview {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface UserCreate {
  email: string;
  name: string;
  avatar_url?: string;
}

export interface UserUpdate {
  name?: string;
  avatar_url?: string;
}

export interface UserDetails extends User {
  // Add any additional fields that might be needed for detailed user view
  // This extends the base User interface with more comprehensive data
}
