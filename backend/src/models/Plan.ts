import mongoose, { Schema, Document } from 'mongoose';

export enum FileType {
  DWG = 'DWG',
  DXF = 'DXF',
  OBJ = 'OBJ',
  FBX = 'FBX',
  STL = 'STL',
  IFC = 'IFC',
  GLTF = 'GLTF',
  PDF = 'PDF'
}

export enum PlanStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED'
}

export interface IPlan extends Document {
  name: string;
  description?: string;
  fileType: FileType;
  fileUrl: string;
  fileSize: number;
  status: PlanStatus;
  userId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  description: { type: String },
  fileType: { type: String, enum: Object.values(FileType), required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  status: { type: String, enum: Object.values(PlanStatus), default: PlanStatus.UPLOADED },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

// Indexes
planSchema.index({ userId: 1 });
planSchema.index({ status: 1 });
planSchema.index({ createdAt: -1 });

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
