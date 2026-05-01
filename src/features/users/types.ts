export interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

export interface UserCompany {
  name: string;
  catchPhrase: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: UserAddress;
  company: UserCompany;
}

export interface TransformedUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: UserAddress;
  company: UserCompany;
  formattedAddress: string;
}

export type SortBy = 'id' | 'name-asc' | 'name-desc';

export interface UsersState {
  users: TransformedUser[];
  loading: boolean;
  refreshing: boolean;
  retrying: boolean;
  error: string | null;
  searchQuery: string;
  page: number;
  hasMore: boolean;
  sortBy: SortBy;
}
