/**
 * Plan Controller - MongoDB Version
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Plan, DetectedProduct } from '../models';

export const uploadPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.file) {
      res.status(400).json({ success: false, message: 'Missing required data' });
      return;
    }

    const { name, description } = req.body;
    const fileExt = req.file.originalname.split('.').pop()?.toUpperCase() || 'OBJ';

    const plan = await Plan.create({
      name: name || req.file.originalname,
      description,
      fileType: fileExt as any,
      fileUrl: req.file.path,
      fileSize: req.file.size,
      userId: req.user.userId,
      status: 'UPLOADED',
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error('Upload plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload plan' });
  }
};

export const getPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const plans = await Plan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch plans' });
  }
};

export const getPlanById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const plan = await Plan.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch plan' });
  }
};

export const updatePlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { name, description } = req.body;
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, description },
      { new: true }
    );

    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to update plan' });
  }
};

export const deletePlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const plan = await Plan.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    await DetectedProduct.deleteMany({ planId: plan._id });
    res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete plan' });
  }
};

export const getDetectedProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const plan = await Plan.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    const products = await DetectedProduct.find({ planId: plan._id }).populate('productId');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Get detected products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch detected products' });
  }
};
