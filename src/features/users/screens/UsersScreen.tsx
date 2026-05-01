import { StyleSheet, View } from 'react-native';
import UserList from '../components/UserList';

const UsersScreen = () => (
  <View style={styles.container}>
    <UserList />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

export default UsersScreen;
