import { Stack } from 'expo-router';

// El panel no tiene index: arranca en /users.
export const unstable_settings = { initialRouteName: 'users' };

export default function AdminPanelLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="users" />
      <Stack.Screen name="user/[id]" />
    </Stack>
  );
}