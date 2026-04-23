import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AppDataProvider>
    </AuthProvider>
  );
}