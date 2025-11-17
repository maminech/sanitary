/**
 * Quote Engine
 * Dynamic quote calculation and management
 */

import { Quote, Product, DetectedProduct, Plan } from '../models';

export interface QuoteCalculation {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface QuoteItemInput {
  detectedProductId?: string;
  productId: string;
  quantity: number;
  discount?: number;
  selectedMaterial?: string;
  customOptions?: any;
  notes?: string;
}

/**
 * Calculate item total
 */
const calculateItemTotal = (
  unitPrice: number,
  quantity: number,
  discount: number = 0
): number => {
  const subtotal = unitPrice * quantity;
  const discountAmount = (subtotal * discount) / 100;
  return subtotal - discountAmount;
};

/**
 * Calculate quote totals
 */
export const calculateQuoteTotals = (
  items: Array<{ unitPrice: number; quantity: number; discount: number }>,
  taxRate: number = 0,
  globalDiscount: number = 0
): QuoteCalculation => {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemTotal(item.unitPrice, item.quantity, item.discount);
  }, 0);

  // Apply global discount
  const discountAmount = (subtotal * globalDiscount) / 100;
  const afterDiscount = subtotal - discountAmount;

  // Calculate tax
  const taxAmount = (afterDiscount * taxRate) / 100;

  // Calculate total
  const total = afterDiscount + taxAmount;

  return {
    subtotal,
    tax: taxAmount,
    discount: discountAmount,
    total,
  };
};

/**
 * Generate unique quote reference
 */
export const generateQuoteReference = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  // Count quotes this month
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const count = await prisma.quote.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `QT-${year}${month}-${sequence}`;
};

/**
 * Create quote from detected products
 */
export const createQuoteFromPlan = async (
  planId: string,
  userId: string,
  title?: string
): Promise<any> => {
  // Get plan and detected products
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: {
      detectedProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!plan) {
    throw new Error('Plan not found');
  }

  // Generate reference
  const reference = await generateQuoteReference();

  // Prepare quote items
  const items: QuoteItemInput[] = [];

  for (const detected of plan.detectedProducts) {
    if (detected.product) {
      items.push({
        detectedProductId: detected.id,
        productId: detected.product.id,
        quantity: 1,
        discount: 0,
      });
    }
  }

  // Create quote with items
  const quote = await createQuote({
    planId,
    userId,
    title: title || `Quote for ${plan.name}`,
    items,
  });

  return quote;
};

/**
 * Create new quote
 */
export const createQuote = async (data: {
  planId: string;
  userId: string;
  title: string;
  description?: string;
  items: QuoteItemInput[];
  taxRate?: number;
  globalDiscount?: number;
}): Promise<any> => {
  const { planId, userId, title, description, items, taxRate = 20, globalDiscount = 0 } = data;

  // Fetch product details
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: productIds },
  });

  const productMap = new Map(products.map((p: any) => [String(p._id), p]));

  // Calculate item totals
  const quoteItems = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const unitPrice = product.basePrice;
    const quantity = item.quantity;
    const discount = item.discount || 0;
    const total = calculateItemTotal(unitPrice, quantity, discount);

    return {
      detectedProductId: item.detectedProductId,
      productId: item.productId,
      name: product.name,
      reference: product.reference,
      description: product.description,
      unitPrice,
      quantity,
      discount,
      total,
      selectedMaterial: item.selectedMaterial,
      customOptions: item.customOptions as Prisma.InputJsonValue,
      notes: item.notes,
    };
  });

  // Calculate totals
  const totals = calculateQuoteTotals(
    quoteItems.map((item) => ({
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      discount: item.discount,
    })),
    taxRate,
    globalDiscount
  );

  // Generate reference
  const reference = await generateQuoteReference();

  // Create quote with items
  const quote = await prisma.quote.create({
    data: {
      reference,
      planId,
      userId,
      title,
      description,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
      items: {
        create: quoteItems,
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              reference: true,
              name: true,
              thumbnailUrl: true,
              type: true,
            },
          },
          detectedProduct: true,
        },
      },
      plan: true,
    },
  });

  return quote;
};

/**
 * Update quote item
 */
export const updateQuoteItem = async (
  quoteId: string,
  itemId: string,
  updates: Partial<QuoteItemInput>
): Promise<any> => {
  // Get current item
  const item = await prisma.quoteItem.findUnique({
    where: { id: itemId },
    include: {
      product: true,
      quote: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!item || item.quoteId !== quoteId) {
    throw new Error('Quote item not found');
  }

  // If product changed, fetch new product
  let unitPrice = item.unitPrice;
  let name = item.name;
  let reference = item.reference;

  if (updates.productId && updates.productId !== item.productId) {
    const newProduct = await prisma.product.findUnique({
      where: { id: updates.productId },
    });

    if (!newProduct) {
      throw new Error('Product not found');
    }

    unitPrice = newProduct.basePrice;
    name = newProduct.name;
    reference = newProduct.reference;
  }

  // Calculate new item total
  const quantity = updates.quantity ?? item.quantity;
  const discount = updates.discount ?? item.discount;
  const total = calculateItemTotal(unitPrice, quantity, discount);

  // Update item
  const updatedItem = await prisma.quoteItem.update({
    where: { id: itemId },
    data: {
      productId: updates.productId,
      name,
      reference,
      unitPrice,
      quantity,
      discount,
      total,
      selectedMaterial: updates.selectedMaterial,
      customOptions: updates.customOptions as Prisma.InputJsonValue,
      notes: updates.notes,
    },
    include: {
      product: true,
    },
  });

  // Recalculate quote totals
  await recalculateQuoteTotals(quoteId);

  return updatedItem;
};

/**
 * Recalculate quote totals
 */
export const recalculateQuoteTotals = async (quoteId: string): Promise<void> => {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true },
  });

  if (!quote) {
    throw new Error('Quote not found');
  }

  const totals = calculateQuoteTotals(
    quote.items.map((item: any) => ({
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      discount: item.discount,
    })),
    (quote.tax / quote.subtotal) * 100 || 0,
    (quote.discount / quote.subtotal) * 100 || 0
  );

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
    },
  });
};

/**
 * Add item to quote
 */
export const addQuoteItem = async (
  quoteId: string,
  itemData: QuoteItemInput
): Promise<any> => {
  const product = await prisma.product.findUnique({
    where: { id: itemData.productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const total = calculateItemTotal(
    product.basePrice,
    itemData.quantity,
    itemData.discount || 0
  );

  const item = await prisma.quoteItem.create({
    data: {
      quoteId,
      detectedProductId: itemData.detectedProductId,
      productId: itemData.productId,
      name: product.name,
      reference: product.reference,
      description: product.description,
      unitPrice: product.basePrice,
      quantity: itemData.quantity,
      discount: itemData.discount || 0,
      total,
      selectedMaterial: itemData.selectedMaterial,
      customOptions: itemData.customOptions as Prisma.InputJsonValue,
      notes: itemData.notes,
    },
    include: {
      product: true,
    },
  });

  await recalculateQuoteTotals(quoteId);

  return item;
};

/**
 * Remove item from quote
 */
export const removeQuoteItem = async (
  quoteId: string,
  itemId: string
): Promise<void> => {
  await prisma.quoteItem.delete({
    where: { id: itemId, quoteId },
  });

  await recalculateQuoteTotals(quoteId);
};
