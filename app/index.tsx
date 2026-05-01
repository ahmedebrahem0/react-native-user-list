import Head from 'expo-router/head';

import UsersScreen from '../src/features/users/screens/UsersScreen';

const HomeRoute = () => (
  <>
    <Head>
      <title>User List</title>
      <meta
        name="description"
        content="Browse, search, and sort users in a fast React Native web app built with Expo Router."
      />
    </Head>
    <UsersScreen />
  </>
);

export default HomeRoute;
