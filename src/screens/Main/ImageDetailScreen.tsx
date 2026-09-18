import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import { Button } from '../../components/Button';
import { useGalleryStore } from '../../store/useGalleryStore';
import { RootStackScreenProps } from '../../types/navigation';

let documentDirectory: any;
let downloadAsync: any;
let MediaLibrary: any;

if (Platform.OS !== 'web') {
  const fs = require('expo-file-system/legacy');
  documentDirectory = fs.documentDirectory;
  downloadAsync = fs.downloadAsync;
  MediaLibrary = require('expo-media-library');
}

const { height, width } = Dimensions.get('window');

export const ImageDetailScreen: React.FC<RootStackScreenProps<'ImageDetail'>> = ({ route, navigation }) => {
  const { image } = route.params;
  const { toggleFavorite, isFavorite } = useGalleryStore();
  const [downloading, setDownloading] = useState(false);

  const favorite = isFavorite(image.id);

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      window.alert('Downloading images is only supported on mobile devices.');
      return;
    }
    
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save images.');
        return;
      }

      setDownloading(true);
      const fileUri = `${documentDirectory}${image.id}.jpg`;
      
      const { uri } = await downloadAsync(image.download_url, fileUri);
      
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('GalleryApp', asset, false);
      
      Alert.alert('Success', 'Image downloaded successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to download image.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.download_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.bottomSheet}>
        <View style={styles.detailsHeader}>
          <Text style={styles.author} numberOfLines={1}>{image.author}</Text>
          <Text style={styles.dimensions}>{image.width} × {image.height}</Text>
        </View>
        
        <View style={styles.actions}>
          <Button
            title={favorite ? 'Favorited ♥' : 'Favorite ♡'}
            onPress={() => toggleFavorite(image)}
            variant={favorite ? 'danger' : 'secondary'}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Download"
            onPress={handleDownload}
            loading={downloading}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height,
    position: 'absolute',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 20, 25, 0.85)',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  detailsHeader: {
    marginBottom: 24,
  },
  author: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  dimensions: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '600',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
