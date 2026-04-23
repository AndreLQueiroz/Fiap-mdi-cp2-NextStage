import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function EmptyState({ title, message }) {
  return (
    <View style={styles.container}>
      <Ionicons name="file-tray-outline" size={42} color={COLORS.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  message: {
    marginTop: 6,
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
  },
});