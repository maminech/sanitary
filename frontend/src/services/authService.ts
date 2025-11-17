/**
 * Authentication Service
 */

import api from './api';
import { User } from '../stores/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ARCHITECT' | 'SUPPLIER' | 'CLIENT';
  company?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data.data;
};

/**
 * Register user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data.data;
};

/**
 * Logout user
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await api.post('/auth/logout', { refreshToken });
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/auth/profile', data);
  return response.data.data;
};
