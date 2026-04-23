import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}