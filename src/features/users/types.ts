export interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: UserAddress;
}

// بعد الـ transformation
export interface TransformedUser {
  id: number;
  name: string;
  email: string;
  formattedAddress: string;
}

export interface UsersState {
  users: TransformedUser[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  page: number;
  hasMore: boolean;
}