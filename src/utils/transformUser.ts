import type { User, TransformedUser } from '../features/users/types';

export const transformUser = (user: User): TransformedUser => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  phone: user.phone,
  website: user.website,
  address: user.address,
  company: user.company,
  formattedAddress: `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`,
});

export const transformUsers = (users: User[]): TransformedUser[] =>
  users.map(transformUser);
