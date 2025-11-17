/**
 * Quote Controller - MongoDB Version
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Quote, Plan, Product } from '../models';

export const createQuoteFromPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { planId } = req.body;
    const plan = await Plan.findOne({ _id: planId, userId: req.user.userId });
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    const quoteNumber = `QT-${Date.now()}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const quote = await Quote.create({
      quoteNumber,
      userId: req.user.userId,
      planId,
      status: 'DRAFT',
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      validUntil,
    });

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ success: false, message: 'Failed to create quote' });
  }
};

export const getQuotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const quotes = await Quote.find({ userId: req.user.userId })
      .populate('planId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quotes' });
  }
};

export const getQuoteById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('planId', 'name')
      .populate('items.productId');

    if (!quote) {
      res.status(404).json({ success: false, message: 'Quote not found' });
      return;
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quote' });
  }
};

export const updateQuote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { status, notes, discount, tax } = req.body;
    const quote = await Quote.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status, notes, discount, tax },
      { new: true }
    );

    if (!quote) {
      res.status(404).json({ success: false, message: 'Quote not found' });
      return;
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quote' });
  }
};

export const addQuoteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { productId, quantity, selectedMaterial } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!quote) {
      res.status(404).json({ success: false, message: 'Quote not found' });
      return;
    }

    const item = {
      productId: product._id,
      quantity: quantity || 1,
      unitPrice: product.basePrice,
      discount: 0,
      selectedMaterial,
      total: product.basePrice * (quantity || 1),
    };

    quote.items.push(item as any);
    quote.subtotal = quote.items.reduce((sum, i) => sum + i.total, 0);
    quote.total = quote.subtotal - quote.discount + quote.tax;
    await quote.save();

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Add quote item error:', error);
    res.status(500).json({ success: false, message: 'Failed to add quote item' });
  }
};

export const updateQuoteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { quantity, discount, selectedMaterial } = req.body;
    const quote = await Quote.findOne({ _id: req.params.quoteId, userId: req.user.userId });
    if (!quote) {
      res.status(404).json({ success: false, message: 'Quote not found' });
      return;
    }

    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex < 0 || itemIndex >= quote.items.length) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }

    if (quantity !== undefined) quote.items[itemIndex].quantity = quantity;
    if (discount !== undefined) quote.items[itemIndex].discount = discount;
    if (selectedMaterial !== undefined) quote.items[itemIndex].selectedMaterial = selectedMaterial;

    quote.items[itemIndex].total =
      (quote.items[itemIndex].unitPrice * quote.items[itemIndex].quantity) - quote.items[itemIndex].discount;

    quote.subtotal = quote.items.reduce((sum, i) => sum + i.total, 0);
    quote.total = quote.subtotal - quote.discount + quote.tax;
    await quote.save();

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Update quote item error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quote item' });
  }
};

export const deleteQuoteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const quote = await Quote.findOne({ _id: req.params.quoteId, userId: req.user.userId });
    if (!quote) {
      res.status(404).json({ success: false, message: 'Quote not found' });
      return;
    }

    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex < 0 || itemIndex >= quote.items.length) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }

    quote.items.splice(itemIndex, 1);
    quote.subtotal = quote.items.reduce((sum, i) => sum + i.total, 0);
    quote.total = quote.subtotal - quote.discount + quote.tax;
    await quote.save();

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Delete quote item error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete quote item' });
  }
};
