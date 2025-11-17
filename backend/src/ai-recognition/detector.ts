/**
 * AI Recognition Module
 * Rule-based sanitary product detection from 3D/2D plans
 * Ready for future ML model integration
 */

import { ProductType } from '../models/Product';

export interface DetectionResult {
  type: ProductType;
  name: string;
  confidence: number;
  position: { x: number; y: number; z: number };
  dimensions: { width?: number; height?: number; depth?: number };
  boundingBox?: BoundingBox;
}

export interface BoundingBox {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
}

export interface ParsedPlanData {
  objects: Array<{
    name: string;
    type?: string;
    position: { x: number; y: number; z: number };
    dimensions?: { width?: number; height?: number; depth?: number };
    geometry?: any;
  }>;
}

/**
 * Product detection rules based on keywords
 */
const PRODUCT_KEYWORDS: Record<ProductType, string[]> = {
  TOILET: ['toilet', 'wc', 'water closet', 'commode', 'lavatory'],
  SINK: ['sink', 'washbasin', 'basin', 'lavabo', 'hand basin'],
  FAUCET: ['faucet', 'tap', 'mixer', 'valve', 'spout'],
  SHOWER: ['shower', 'douche', 'shower head', 'rain shower'],
  BATHTUB: ['bathtub', 'bath', 'tub', 'baignoire', 'jacuzzi'],
  BIDET: ['bidet'],
  URINAL: ['urinal', 'urinals', 'wall urinal'],
  WASHBASIN: ['washbasin', 'wash basin', 'pedestal basin'],
  SHOWER_TRAY: ['shower tray', 'shower base', 'shower pan', 'receveur'],
  SHOWER_CABIN: ['shower cabin', 'shower enclosure', 'shower cubicle', 'cabine'],
  ACCESSORIES: ['towel', 'holder', 'rack', 'dispenser', 'mirror', 'shelf'],
  OTHER: [],
};

/**
 * Typical dimensions for sanitary products (in meters)
 */
const TYPICAL_DIMENSIONS: Record<
  ProductType,
  { width: [number, number]; height: [number, number]; depth: [number, number] }
> = {
  TOILET: {
    width: [0.35, 0.45],
    height: [0.4, 0.8],
    depth: [0.5, 0.75],
  },
  SINK: {
    width: [0.4, 0.8],
    height: [0.15, 0.25],
    depth: [0.4, 0.6],
  },
  FAUCET: {
    width: [0.05, 0.15],
    height: [0.15, 0.35],
    depth: [0.05, 0.15],
  },
  SHOWER: {
    width: [0.15, 0.25],
    height: [0.15, 0.3],
    depth: [0.05, 0.15],
  },
  BATHTUB: {
    width: [0.7, 0.9],
    height: [0.4, 0.6],
    depth: [1.4, 1.8],
  },
  BIDET: {
    width: [0.35, 0.45],
    height: [0.35, 0.45],
    depth: [0.5, 0.65],
  },
  URINAL: {
    width: [0.3, 0.45],
    height: [0.45, 0.65],
    depth: [0.3, 0.4],
  },
  WASHBASIN: {
    width: [0.45, 0.65],
    height: [0.15, 0.25],
    depth: [0.45, 0.55],
  },
  SHOWER_TRAY: {
    width: [0.7, 1.2],
    height: [0.05, 0.15],
    depth: [0.7, 1.2],
  },
  SHOWER_CABIN: {
    width: [0.8, 1.2],
    height: [1.9, 2.3],
    depth: [0.8, 1.2],
  },
  ACCESSORIES: {
    width: [0.1, 0.5],
    height: [0.05, 0.5],
    depth: [0.05, 0.3],
  },
  OTHER: {
    width: [0.1, 2],
    height: [0.1, 2],
    depth: [0.1, 2],
  },
};

/**
 * Detect product type from name using keyword matching
 */
export const detectTypeFromName = (name: string): ProductType | null => {
  const lowerName = name.toLowerCase();

  for (const [type, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return type as ProductType;
      }
    }
  }

  return null;
};

/**
 * Detect product type from dimensions
 */
export const detectTypeFromDimensions = (dimensions: {
  width?: number;
  height?: number;
  depth?: number;
}): ProductType | null => {
  if (!dimensions.width || !dimensions.height || !dimensions.depth) {
    return null;
  }

  const matches: Array<{ type: ProductType; score: number }> = [];

  for (const [type, typical] of Object.entries(TYPICAL_DIMENSIONS)) {
    let score = 0;

    // Check if dimensions fall within typical ranges
    if (
      dimensions.width >= typical.width[0] &&
      dimensions.width <= typical.width[1]
    ) {
      score++;
    }

    if (
      dimensions.height >= typical.height[0] &&
      dimensions.height <= typical.height[1]
    ) {
      score++;
    }

    if (
      dimensions.depth >= typical.depth[0] &&
      dimensions.depth <= typical.depth[1]
    ) {
      score++;
    }

    if (score >= 2) {
      matches.push({ type: type as ProductType, score });
    }
  }

  if (matches.length === 0) return null;

  // Return the match with highest score
  matches.sort((a, b) => b.score - a.score);
  return matches[0].type;
};

/**
 * Calculate confidence score
 */
const calculateConfidence = (
  nameMatch: boolean,
  dimensionMatch: boolean,
  hasGeometry: boolean
): number => {
  let confidence = 0;

  if (nameMatch) confidence += 0.6;
  if (dimensionMatch) confidence += 0.3;
  if (hasGeometry) confidence += 0.1;

  return Math.min(confidence, 1.0);
};

/**
 * Extract bounding box from geometry
 */
const extractBoundingBox = (geometry: any): BoundingBox | undefined => {
  try {
    // This would work with actual Three.js geometry
    if (geometry && geometry.boundingBox) {
      return {
        min: {
          x: geometry.boundingBox.min.x,
          y: geometry.boundingBox.min.y,
          z: geometry.boundingBox.min.z,
        },
        max: {
          x: geometry.boundingBox.max.x,
          y: geometry.boundingBox.max.y,
          z: geometry.boundingBox.max.z,
        },
      };
    }
  } catch (error) {
    console.error('Error extracting bounding box:', error);
  }
  return undefined;
};

/**
 * Calculate dimensions from bounding box
 */
const calculateDimensions = (boundingBox: BoundingBox) => {
  return {
    width: Math.abs(boundingBox.max.x - boundingBox.min.x),
    height: Math.abs(boundingBox.max.y - boundingBox.min.y),
    depth: Math.abs(boundingBox.max.z - boundingBox.min.z),
  };
};

/**
 * Main detection function
 */
export const detectSanitaryProducts = async (
  planData: ParsedPlanData
): Promise<DetectionResult[]> => {
  const results: DetectionResult[] = [];

  for (const obj of planData.objects) {
    // Skip if no name
    if (!obj.name) continue;

    // Detect from name
    const typeFromName = detectTypeFromName(obj.name);

    // Extract dimensions
    let dimensions = obj.dimensions;
    let boundingBox: BoundingBox | undefined;

    if (obj.geometry) {
      boundingBox = extractBoundingBox(obj.geometry);
      if (boundingBox && !dimensions) {
        dimensions = calculateDimensions(boundingBox);
      }
    }

    // Detect from dimensions if available
    const typeFromDimensions = dimensions
      ? detectTypeFromDimensions(dimensions)
      : null;

    // Determine final type
    const detectedType = typeFromName || typeFromDimensions;

    if (!detectedType) continue;

    // Calculate confidence
    const confidence = calculateConfidence(
      !!typeFromName,
      !!typeFromDimensions,
      !!obj.geometry
    );

    results.push({
      type: detectedType,
      name: obj.name,
      confidence,
      position: obj.position,
      dimensions: dimensions || {},
      boundingBox,
    });
  }

  return results;
};

/**
 * Parse plan file (placeholder for actual parser)
 * In production, this would use libraries like:
 * - node-dxf for DXF files
 * - three.js loaders for OBJ, FBX, STL
 */
export const parsePlanFile = async (
  filePath: string,
  fileType: string
): Promise<ParsedPlanData> => {
  // Placeholder implementation
  // In production, implement actual parsers for each file type

  console.log(`Parsing ${fileType} file: ${filePath}`);

  // Mock data for demonstration
  return {
    objects: [
      {
        name: 'Toilet_01',
        position: { x: 2.5, y: 0, z: 1.5 },
        dimensions: { width: 0.4, height: 0.75, depth: 0.6 },
      },
      {
        name: 'Sink_Wall_Mount',
        position: { x: 1.2, y: 0.85, z: 0.5 },
        dimensions: { width: 0.5, height: 0.2, depth: 0.45 },
      },
      {
        name: 'Shower_Tray_90x90',
        position: { x: 4.0, y: 0, z: 2.0 },
        dimensions: { width: 0.9, height: 0.1, depth: 0.9 },
      },
    ],
  };
};

/**
 * Find similar products from catalog based on detected product
 */
export const findSimilarProducts = (
  detectedType: ProductType,
  dimensions?: { width?: number; height?: number; depth?: number }
): any => {
  // This would query the database for similar products
  return {
    type: detectedType,
    dimensions,
    query: 'Similar products matching criteria',
  };
};
