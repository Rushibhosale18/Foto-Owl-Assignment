import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { PicsumImage } from '../types/gallery';
import { useGalleryStore } from '../store/useGalleryStore';
import { LinearGradient } from 'expo-linear-gradient';

interface ImageCardProps {
  image: PicsumImage;
  onPress: () => void;
}

const { width } = Dimensions.get('window');

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress }) => {
  const { toggleFavorite, isFavorite } = useGalleryStore();
  const favorite = isFavorite(image.id);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image
        source={{ uri: image.download_url }}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Fallback to simple semi-transparent view if expo-linear-gradient is not installed, 
          but usually Expo projects can install it easily. We will use standard View for safety 
          or assume expo-linear-gradient can be added. I'll use a translucent View to be safe. */}
      <View style={styles.overlay}>
        <Text style={styles.author} numberOfLines={1}>{image.author}</Text>
        <TouchableOpacity 
          style={[styles.favBtn, favorite && styles.favBtnActive]} 
          onPress={() => toggleFavorite(image)}
        >
          <Text style={styles.favIcon}>{favorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Creates a perfect square for the grid
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  author: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#FF7675',
  },
  favIcon: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 20,
  }
});
