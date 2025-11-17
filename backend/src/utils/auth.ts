import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { RefreshToken } from '../models';
import { appConfig } from '../config/config';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = appConfig.jwt.accessSecret;
  const options: SignOptions = {
    expiresIn: appConfig.jwt.accessExpiry as any,
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = appConfig.jwt.refreshSecret;
  const options: SignOptions = {
    expiresIn: appConfig.jwt.refreshExpiry as any,
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Generate token pair
 */
export const generateTokens = async (user: {
  id: string;
  email: string;
  role: string;
}): Promise<AuthTokens> => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Delete old refresh tokens for this user
  await RefreshToken.deleteMany({ userId: user.id });

  // Store new refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, appConfig.jwt.accessSecret) as TokenPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, appConfig.jwt.refreshSecret) as TokenPayload;
};

/**
 * Revoke refresh token
 */
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await RefreshToken.deleteOne({ token });
};

/**
 * Clean expired refresh tokens
 */
export const cleanExpiredTokens = async (): Promise<void> => {
  await RefreshToken.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};
