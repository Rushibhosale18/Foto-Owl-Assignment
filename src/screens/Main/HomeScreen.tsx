import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useFetchImages } from '../../hooks/useFetchImages';
import { ImageCard } from '../../components/ImageCard';
import { useDebounce } from '../../hooks/useDebounce';
import { MainTabScreenProps } from '../../types/navigation';

export const HomeScreen: React.FC<MainTabScreenProps<'Home'>> = ({ navigation }) => {
  const { images, loading, refreshing, loadMore, handleRefresh } = useFetchImages();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filterMode, setFilterMode] = useState<'ALL' | 'A-M' | 'N-Z'>('ALL');
  
  const { width } = useWindowDimensions();
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : width > 480 ? 2 : 1;

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesSearch = img.author.toLowerCase().includes(debouncedSearch.toLowerCase());
      const firstChar = img.author.trim().toUpperCase()[0];
      let matchesFilter = true;
      if (filterMode === 'A-M') {
        matchesFilter = firstChar >= 'A' && firstChar <= 'M';
      } else if (filterMode === 'N-Z') {
        matchesFilter = firstChar >= 'N' && firstChar <= 'Z';
      }
      return matchesSearch && matchesFilter;
    });
  }, [images, debouncedSearch, filterMode]);

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <TextInput
        placeholder="Search by author..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <View style={styles.filterContainer}>
        {(['ALL', 'A-M', 'N-Z'] as const).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.filterButton, filterMode === mode && styles.filterButtonActive]}
            onPress={() => setFilterMode(mode)}
          >
            <Text style={[styles.filterText, filterMode === mode && styles.filterTextActive]}>
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns} // Force remount if columns change
        numColumns={numColumns}
        data={filteredImages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => navigation.navigate('ImageDetail', { image: item })}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator color="#6C5CE7" style={{ margin: 20 }} /> : null}
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
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor: '#121212',
  },
  searchInput: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    padding: 4,
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#6C5CE7',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  filterText: {
    color: '#A0A0A0',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
});
