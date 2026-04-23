import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: error ? theme.error : theme.border,
            color: theme.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />

      {!!error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
  },
});