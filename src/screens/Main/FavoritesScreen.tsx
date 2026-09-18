import React from 'react';
import { View, FlatList, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useGalleryStore } from '../../store/useGalleryStore';
import { ImageCard } from '../../components/ImageCard';
import { MainTabScreenProps } from '../../types/navigation';

export const FavoritesScreen: React.FC<MainTabScreenProps<'Favorites'>> = ({ navigation }) => {
  const { favorites } = useGalleryStore();
  const { width } = useWindowDimensions();
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : width > 480 ? 2 : 1;

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>Images you heart will appear here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns} // Force remount if columns change
        numColumns={numColumns}
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => navigation.navigate('ImageDetail', { image: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
  },
});
