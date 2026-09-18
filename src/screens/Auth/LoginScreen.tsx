import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { validateEmail } from '../../utils/validation';
import { AuthStackParamList } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      showAlert('Error', 'Invalid email format');
      return;
    }
    if (password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('@registered_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          await login(user);
        } else {
          showAlert('Error', 'Invalid credentials');
        }
      } else {
        showAlert('Error', 'User not found. Please register.');
      }
    } catch (error) {
      showAlert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button title="Login" onPress={handleLogin} loading={loading} style={{ marginTop: 10 }} />
        
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkTextBold}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 32,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#A0A0A0',
    fontSize: 15,
  },
  linkTextBold: {
    color: '#6C5CE7',
    fontWeight: '700',
  },
});
