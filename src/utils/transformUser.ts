import type { User, TransformedUser } from '../features/users/types';

export const transformUser = (user: User): TransformedUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  formattedAddress: `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`,
});

export const transformUsers = (users: User[]): TransformedUser[] =>
  users.map(transformUser);