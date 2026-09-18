import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Platform } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainTabScreenProps } from '../../types/navigation';

export const ProfileScreen: React.FC<MainTabScreenProps<'Profile'>> = () => {
  const { user, logout, login } = useAuthStore();
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
    address: user?.address || '',
    city: user?.city || '',
  });

  const handleSave = async () => {
    try {
      const updatedUser = { ...user!, ...formData };
      await login(updatedUser);
      await AsyncStorage.setItem('@registered_user', JSON.stringify(updatedUser));
      setEditing(false);
      if (Platform.OS === 'web') {
        window.alert('Profile updated successfully');
      } else {
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Failed to update profile');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{formData.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{formData.fullName}</Text>
        <Text style={styles.email}>{formData.email}</Text>
      </View>

      <View style={styles.card}>
        <InputField
          label="Full Name"
          value={formData.fullName}
          onChangeText={(t) => setFormData({ ...formData, fullName: t })}
          editable={editing}
        />
        <InputField
          label="Mobile"
          value={formData.mobile}
          onChangeText={(t) => setFormData({ ...formData, mobile: t })}
          keyboardType="phone-pad"
          editable={editing}
        />
        <InputField
          label="Gender"
          value={formData.gender}
          onChangeText={(t) => setFormData({ ...formData, gender: t })}
          editable={editing}
        />
        <InputField
          label="City"
          value={formData.city}
          onChangeText={(t) => setFormData({ ...formData, city: t })}
          editable={editing}
        />

        {editing ? (
          <View style={styles.actions}>
            <Button title="Save Profile" onPress={handleSave} style={{ flex: 1, marginRight: 8 }} />
            <Button title="Cancel" onPress={() => setEditing(false)} variant="secondary" style={{ flex: 1, marginLeft: 8 }} />
          </View>
        ) : (
          <Button title="Edit Details" onPress={() => setEditing(true)} variant="secondary" />
        )}
      </View>
      
      <Button title="Logout" onPress={logout} variant="danger" style={{ marginTop: 24, marginHorizontal: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1E1E1E',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  }
});
