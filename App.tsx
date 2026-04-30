import { Provider } from 'react-redux';
import { store } from './store/store';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import UserList from './features/users/components/UserList';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView
        style={styles.safeArea}
        accessibilityRole="none"
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
        />

        {/* Header */}
        <View
          style={styles.header}
          accessible={true}
          accessibilityRole="header"
        >
          <Text style={styles.title}>User List</Text>
          <Text style={styles.subtitle}>
            Browse and search users
          </Text>
        </View>

        {/* Content */}
        <View
          style={styles.content}
          accessible={false}
        >
          <UserList />
        </View>

      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
});

export default App;