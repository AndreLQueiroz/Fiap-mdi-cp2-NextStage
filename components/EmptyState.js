import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function EmptyState({ title, message }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Ionicons name="file-tray-outline" size={42} color={theme.primary} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textLight }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 14,
  },
});