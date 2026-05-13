import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

/**
 * useCategories Hook - Fetches event categories
 */
function extractCategories(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.$values)) return payload.$values;
  if (Array.isArray(payload?.value)) return payload.value;
  if (payload?.data && Array.isArray(payload.data.$values)) return payload.data.$values;
  
  // If it's an object with numeric keys, it might be an array-like object
  const values = Object.values(payload);
  if (values.length > 0 && typeof values[0] === 'object' && ('id' in values[0] || 'Id' in values[0])) {
      return values;
  }
  
  return [];
}

function normalizeCategory(category) {
  if (!category || typeof category !== 'object') return category;

  return {
    ...category,
    id: category.id ?? category.Id ?? category.categoryId ?? category.CategoryId ?? '',
    name: category.name ?? category.Name ?? category.categoryName ?? category.CategoryName ?? '',
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await categoryService.getCategories();
        return extractCategories(response?.data ?? response).map(normalizeCategory);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
