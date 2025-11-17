/**
 * Product Controller - MongoDB Version
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Product } from '../models';

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const productData = { ...req.body, supplierId: req.user.userId };
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, inStock, search, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
    if (type) query.type = type;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId', 'name email company');
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, supplierId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const product = await Product.findOneAndDelete({ _id: req.params.id, supplierId: req.user.userId });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

export const getSimilarProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      type: product.type,
      inStock: true,
    }).limit(6);

    res.status(200).json({ success: true, data: similarProducts });
  } catch (error) {
    console.error('Get similar products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch similar products' });
  }
};
