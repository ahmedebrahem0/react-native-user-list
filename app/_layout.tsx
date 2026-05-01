import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';

const RootLayout = () => (
  <Provider store={store}>
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerShadowVisible: false,
        headerTintColor: '#0f172a',
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'User List',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="users/[userId]"
        options={{
          title: 'User Details',
        }}
      />
    </Stack>
  </Provider>
);

export default RootLayout;
