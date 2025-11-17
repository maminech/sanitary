import mongoose, { Schema, Document } from 'mongoose';

export interface IDetectedProduct extends Document {
  planId: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  detectedType: string;
  confidence: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  boundingBox?: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const detectedProductSchema = new Schema<IDetectedProduct>({
  planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  detectedType: { type: String, required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  rotation: {
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
  },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  boundingBox: {
    min: {
      x: { type: Number },
      y: { type: Number },
      z: { type: Number },
    },
    max: {
      x: { type: Number },
      y: { type: Number },
      z: { type: Number },
    },
  },
  metadata: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

// Indexes
detectedProductSchema.index({ planId: 1 });
detectedProductSchema.index({ productId: 1 });
detectedProductSchema.index({ confidence: -1 });

export const DetectedProduct = mongoose.model<IDetectedProduct>('DetectedProduct', detectedProductSchema);
