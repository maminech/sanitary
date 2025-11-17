/**
 * Product Service
 */

import api from './api';

export interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  type: 'SINK' | 'TOILET' | 'BATHTUB' | 'SHOWER' | 'FAUCET' | 'BIDET' | 'URINAL' | 'ACCESSORY';
  category?: string;
  brand?: string;
  basePrice: number;
  currency: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight?: number;
  material?: string;
  color?: string;
  finish?: string;
  stock: number;
  minStock: number;
  leadTime?: number;
  images: string[];
  technicalSheet?: string;
  installationGuide?: string;
  warranty?: number;
  certifications?: string[];
  features?: string[];
  tags?: string[];
  isActive: boolean;
  supplier?: {
    id: string;
    name: string;
    contactEmail?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  type?: string;
  category?: string;
  brand?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Get all products with optional filters
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const response = await api.get(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  return response.data.data;
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

/**
 * Create new product (supplier only)
 */
export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  const response = await api.post('/products', data);
  return response.data.data;
};

/**
 * Update product (supplier only)
 */
export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, data);
  return response.data.data;
};

/**
 * Delete product (supplier only)
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

/**
 * Upload product image
 */
export const uploadProductImage = async (productId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('uploadType', 'products');

  const response = await api.post(`/products/${productId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.url;
};
