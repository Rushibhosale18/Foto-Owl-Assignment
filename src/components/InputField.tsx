import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isFocused && styles.labelFocused, error && styles.labelError]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError
        ]}
        placeholderTextColor="#666"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#A0A0A0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelFocused: {
    color: '#6C5CE7',
  },
  labelError: {
    color: '#FF7675',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#6C5CE7',
    backgroundColor: '#252530',
  },
  inputError: {
    borderColor: '#FF7675',
  },
  errorText: {
    color: '#FF7675',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
