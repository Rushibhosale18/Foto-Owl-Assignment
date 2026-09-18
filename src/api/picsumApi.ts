import { PicsumImage } from '../types/gallery';

export const fetchImagesApi = async (page: number, limit: number = 20): Promise<PicsumImage[]> => {
  const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
