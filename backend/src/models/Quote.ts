import mongoose, { Schema, Document } from 'mongoose';

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface IQuoteItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  discount: number;
  selectedMaterial?: string;
  total: number;
}

export interface IQuote extends Document {
  quoteNumber: string;
  userId: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId;
  status: QuoteStatus;
  items: IQuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const quoteItemSchema = new Schema<IQuoteItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  selectedMaterial: { type: String },
  total: { type: Number, required: true, min: 0 },
}, { _id: false });

const quoteSchema = new Schema<IQuote>({
  quoteNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan' },
  status: { type: String, enum: Object.values(QuoteStatus), default: QuoteStatus.DRAFT },
  items: [quoteItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, default: 0 },
  validUntil: { type: Date, required: true },
  notes: { type: String },
}, {
  timestamps: true,
});

// Indexes
quoteSchema.index({ quoteNumber: 1 });
quoteSchema.index({ userId: 1 });
quoteSchema.index({ planId: 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });

export const Quote = mongoose.model<IQuote>('Quote', quoteSchema);
