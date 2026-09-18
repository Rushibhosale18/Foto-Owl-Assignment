import { useState, useCallback, useRef, useEffect } from 'react';
import { PicsumImage } from '../types/gallery';
import { fetchImagesApi } from '../api/picsumApi';

export const useFetchImages = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Guard flag using useRef to strictly prevent parallel duplicate calls
  const isFetchingRef = useRef(false);

  const fetchImages = useCallback(async (pageNum: number, isRefresh = false) => {
    // Prevent duplicate calls if already fetching
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const data = await fetchImagesApi(pageNum, 20);
      setImages((prev) => (isRefresh ? data : [...prev, ...data]));
    } catch (error) {
      console.error('API Fetch Error:', error);
    } finally {
      isFetchingRef.current = false;
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  const handleRefresh = useCallback(() => {
    if (isFetchingRef.current) return; // Guard duplicate pull gesture
    setRefreshing(true);
    setPage(1);
    fetchImages(1, true);
  }, [fetchImages]);

  const loadMore = useCallback(() => {
    if (!isFetchingRef.current && !loading) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchImages(nextPage, false);
        return nextPage;
      });
    }
  }, [fetchImages, loading]);

  return { images, refreshing, handleRefresh, loadMore, loading };
};
