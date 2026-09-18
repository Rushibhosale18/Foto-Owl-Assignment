import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { validateEmail, validateMobile, RegisterErrors } from '../../utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors: RegisterErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!validateMobile(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      if (Platform.OS === 'web') {
        window.alert('Please fix the errors in the form.');
      } else {
        Alert.alert('Validation Error', 'Please fix the errors in the form.');
      }
      return;
    }
    
    setLoading(true);
    try {
      const user = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      };
      await AsyncStorage.setItem('@registered_user', JSON.stringify(user));
      
      if (Platform.OS === 'web') {
        window.alert('Registration successful');
        navigation.goBack();
      } else {
        Alert.alert('Success', 'Registration successful', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Failed to register');
      } else {
        Alert.alert('Error', 'Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <InputField
            label="Full Name"
            value={formData.fullName}
            onChangeText={(t) => setFormData({ ...formData, fullName: t })}
            error={errors.fullName}
          />
          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(t) => setFormData({ ...formData, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <InputField
            label="Mobile"
            value={formData.mobile}
            onChangeText={(t) => setFormData({ ...formData, mobile: t })}
            keyboardType="phone-pad"
            error={errors.mobile}
          />
          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(t) => setFormData({ ...formData, password: t })}
            secureTextEntry
            error={errors.password}
          />
          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(t) => setFormData({ ...formData, confirmPassword: t })}
            secureTextEntry
            error={errors.confirmPassword}
          />
          <Button title="Register" onPress={handleRegister} loading={loading} style={{ marginTop: 10 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
});
