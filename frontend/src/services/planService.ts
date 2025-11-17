/**
 * Plan Service
 */

import api from './api';

export interface Plan {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  originalFileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  buildingType?: string;
  floor?: string;
  area?: number;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processingError?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  detectedProducts?: DetectedProduct[];
  _count?: {
    detectedProducts: number;
    quotes: number;
  };
}

export interface DetectedProduct {
  id: string;
  planId: string;
  productId?: string;
  type: string;
  name?: string;
  confidence?: number;
  posX: number;
  posY: number;
  posZ: number;
  width?: number;
  height?: number;
  depth?: number;
  boundingBox?: any;
  product?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Upload plan file
 */
export const uploadPlan = async (file: File, metadata: any): Promise<Plan> => {
  const formData = new FormData();
  formData.append('plan', file);
  formData.append('uploadType', 'plans');
  
  Object.keys(metadata).forEach((key) => {
    if (metadata[key] !== undefined) {
      formData.append(key, metadata[key]);
    }
  });

  const response = await api.post('/plans/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

/**
 * Get all plans
 */
export const getPlans = async (): Promise<Plan[]> => {
  const response = await api.get('/plans');
  return response.data.data;
};

/**
 * Get plan by ID
 */
export const getPlanById = async (id: string): Promise<Plan> => {
  const response = await api.get(`/plans/${id}`);
  return response.data.data;
};

/**
 * Update plan
 */
export const updatePlan = async (id: string, data: Partial<Plan>): Promise<Plan> => {
  const response = await api.put(`/plans/${id}`, data);
  return response.data.data;
};

/**
 * Delete plan
 */
export const deletePlan = async (id: string): Promise<void> => {
  await api.delete(`/plans/${id}`);
};

/**
 * Get detected products for plan
 */
export const getDetectedProducts = async (planId: string): Promise<DetectedProduct[]> => {
  const response = await api.get(`/plans/${planId}/products`);
  return response.data.data;
};
