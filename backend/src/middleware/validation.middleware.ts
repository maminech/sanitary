import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware factory
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

// User validation schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    role: z.enum(['ARCHITECT', 'SUPPLIER', 'CLIENT']).optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Plan validation schemas
export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Plan name is required'),
    description: z.string().optional(),
    buildingType: z.string().optional(),
    floor: z.string().optional(),
    area: z.number().positive().optional(),
  }),
});

export const updatePlanSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid plan ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    buildingType: z.string().optional(),
    floor: z.string().optional(),
    area: z.number().positive().optional(),
  }),
});

// Product validation schemas
export const createProductSchema = z.object({
  body: z.object({
    reference: z.string().min(1, 'Product reference is required'),
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    type: z.enum([
      'TOILET',
      'SINK',
      'FAUCET',
      'SHOWER',
      'BATHTUB',
      'BIDET',
      'URINAL',
      'WASHBASIN',
      'SHOWER_TRAY',
      'SHOWER_CABIN',
      'ACCESSORIES',
      'OTHER',
    ]),
    brand: z.string().optional(),
    basePrice: z.number().positive('Price must be positive'),
    currency: z.string().length(3).optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    depth: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    specifications: z.record(z.any()).optional(),
    supplierSKU: z.string().optional(),
    inStock: z.boolean().optional(),
    leadTime: z.number().int().nonnegative().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    reference: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z
      .enum([
        'TOILET',
        'SINK',
        'FAUCET',
        'SHOWER',
        'BATHTUB',
        'BIDET',
        'URINAL',
        'WASHBASIN',
        'SHOWER_TRAY',
        'SHOWER_CABIN',
        'ACCESSORIES',
        'OTHER',
      ])
      .optional(),
    brand: z.string().optional(),
    basePrice: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    depth: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    specifications: z.record(z.any()).optional(),
    supplierSKU: z.string().optional(),
    inStock: z.boolean().optional(),
    leadTime: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Quote validation schemas
export const updateQuoteItemSchema = z.object({
  params: z.object({
    quoteId: z.string().uuid('Invalid quote ID'),
    itemId: z.string().uuid('Invalid item ID'),
  }),
  body: z.object({
    productId: z.string().uuid().optional(),
    quantity: z.number().int().positive().optional(),
    discount: z.number().min(0).max(100).optional(),
    selectedMaterial: z.string().optional(),
    customOptions: z.record(z.any()).optional(),
    notes: z.string().optional(),
  }),
});
