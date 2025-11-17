/**
 * Quote Service
 */

import api from './api';

export interface Quote {
  _id: string;
  quoteNumber: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  planId?: string;
  userId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  globalDiscount: number;
  totalAmount: number;
  validUntil?: string;
  notes?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
  plan?: any;
  user?: any;
}

export interface QuoteItem {
  _id?: string;
  detectedProductId?: string;
  productId: string;
  name: string;
  reference: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
  selectedMaterial?: string;
  customOptions?: any;
  notes?: string;
}

export interface CreateQuoteData {
  planId?: string;
  title: string;
  description?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  items: Array<{
    productId: string;
    detectedProductId?: string;
    quantity: number;
    discount?: number;
    selectedMaterial?: string;
    customOptions?: any;
    notes?: string;
  }>;
  taxRate?: number;
  globalDiscount?: number;
  validUntil?: string;
  notes?: string;
}

/**
 * Get all quotes
 */
export const getQuotes = async (): Promise<Quote[]> => {
  const response = await api.get('/quotes');
  return response.data.data;
};

/**
 * Get quote by ID
 */
export const getQuoteById = async (id: string): Promise<Quote> => {
  const response = await api.get(`/quotes/${id}`);
  return response.data.data;
};

/**
 * Create new quote
 */
export const createQuote = async (data: CreateQuoteData): Promise<Quote> => {
  const response = await api.post('/quotes', data);
  return response.data.data;
};

/**
 * Update quote
 */
export const updateQuote = async (id: string, data: Partial<CreateQuoteData>): Promise<Quote> => {
  const response = await api.put(`/quotes/${id}`, data);
  return response.data.data;
};

/**
 * Delete quote
 */
export const deleteQuote = async (id: string): Promise<void> => {
  await api.delete(`/quotes/${id}`);
};

/**
 * Update quote status
 */
export const updateQuoteStatus = async (
  id: string,
  status: Quote['status']
): Promise<Quote> => {
  const response = await api.patch(`/quotes/${id}/status`, { status });
  return response.data.data;
};

/**
 * Export quote to PDF
 */
export const exportQuotePDF = async (id: string): Promise<Blob> => {
  const response = await api.get(`/quotes/${id}/export`, {
    responseType: 'blob',
  });
  return response.data;
};
