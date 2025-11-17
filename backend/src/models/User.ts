import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  ARCHITECT = 'ARCHITECT',
  SUPPLIER = 'SUPPLIER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  company: { type: String },
  phone: { type: String },
}, {
  timestamps: true,
});

// Index for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
