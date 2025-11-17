import mongoose, { Schema, Document } from 'mongoose';

export enum ProductType {
  TOILET = 'TOILET',
  SINK = 'SINK',
  BATHTUB = 'BATHTUB',
  SHOWER = 'SHOWER',
  FAUCET = 'FAUCET',
  MIRROR = 'MIRROR',
  CABINET = 'CABINET',
  URINAL = 'URINAL',
  BIDET = 'BIDET',
  SHOWER_PANEL = 'SHOWER_PANEL',
  TOWEL_RACK = 'TOWEL_RACK',
  ACCESSORY = 'ACCESSORY'
}

export enum MaterialType {
  CERAMIC = 'CERAMIC',
  PORCELAIN = 'PORCELAIN',
  GLASS = 'GLASS',
  STAINLESS_STEEL = 'STAINLESS_STEEL',
  CHROME = 'CHROME',
  BRONZE = 'BRONZE',
  BRASS = 'BRASS',
  COMPOSITE = 'COMPOSITE',
  ACRYLIC = 'ACRYLIC',
  WOOD = 'WOOD'
}

export interface IProductMaterial extends Document {
  type: MaterialType;
  finish?: string;
  color?: string;
  priceModifier: number;
}

export interface IAsset3D extends Document {
  format: string;
  fileUrl: string;
  fileSize: number;
  lodLevel?: number;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  type: ProductType;
  description?: string;
  brand?: string;
  basePrice: number;
  supplierId: mongoose.Types.ObjectId;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  materials: IProductMaterial[];
  assets3d: IAsset3D[];
  leadTime?: number;
  inStock: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productMaterialSchema = new Schema<IProductMaterial>({
  type: { type: String, enum: Object.values(MaterialType), required: true },
  finish: { type: String },
  color: { type: String },
  priceModifier: { type: Number, required: true, default: 0 },
}, { _id: false });

const asset3dSchema = new Schema<IAsset3D>({
  format: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  lodLevel: { type: Number },
}, { _id: false });

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  type: { type: String, enum: Object.values(ProductType), required: true },
  description: { type: String },
  brand: { type: String },
  basePrice: { type: Number, required: true, min: 0 },
  supplierId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, default: 'cm' },
  },
  materials: [productMaterialSchema],
  assets3d: [asset3dSchema],
  leadTime: { type: Number },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
}, {
  timestamps: true,
});

// Indexes
productSchema.index({ type: 1 });
productSchema.index({ supplierId: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ inStock: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
