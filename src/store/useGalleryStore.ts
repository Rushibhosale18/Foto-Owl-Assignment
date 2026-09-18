import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicsumImage } from '../types/gallery';

interface GalleryState {
  favorites: PicsumImage[];
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  loadFavorites: () => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],
  toggleFavorite: async (image) => {
    const { favorites } = get();
    const isFav = favorites.some((fav) => fav.id === image.id);
    let newFavorites;
    
    if (isFav) {
      newFavorites = favorites.filter((fav) => fav.id !== image.id);
    } else {
      newFavorites = [...favorites, image];
    }
    
    set({ favorites: newFavorites });
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavorites));
  },
  loadFavorites: async () => {
    const storedFavs = await AsyncStorage.getItem('@favorites');
    if (storedFavs) {
      set({ favorites: JSON.parse(storedFavs) });
    }
  },
  isFavorite: (id) => {
    return get().favorites.some((fav) => fav.id === id);
  }
}));
