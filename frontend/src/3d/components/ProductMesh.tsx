/**
 * Product Mesh Component
 * Renders a 3D mesh for a detected product
 */

import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Box } from '@react-three/drei';
import { DetectedProduct } from '../../services/planService';

interface ProductMeshProps {
  product: DetectedProduct;
  isSelected: boolean;
  onClick: () => void;
}

// Color mapping for product types
const PRODUCT_COLORS: Record<string, string> = {
  TOILET: '#93c5fd',
  SINK: '#86efac',
  FAUCET: '#d4d4d8',
  SHOWER: '#bfdbfe',
  BATHTUB: '#a5f3fc',
  BIDET: '#c4b5fd',
  URINAL: '#a3e635',
  WASHBASIN: '#6ee7b7',
  SHOWER_TRAY: '#99f6e4',
  SHOWER_CABIN: '#7dd3fc',
  ACCESSORIES: '#fcd34d',
  OTHER: '#d1d5db',
};

export default function ProductMesh({ product, isSelected, onClick }: ProductMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = PRODUCT_COLORS[product.type] || PRODUCT_COLORS.OTHER;
  const opacity = isSelected ? 1 : hovered ? 0.9 : 0.7;

  // Use actual dimensions or defaults
  const width = product.width || 0.5;
  const height = product.height || 0.5;
  const depth = product.depth || 0.5;

  return (
    <Box
      ref={meshRef}
      position={[product.posX, product.posY + height / 2, product.posZ]}
      args={[width, height, depth]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={isSelected ? color : undefined}
        emissiveIntensity={isSelected ? 0.3 : 0}
        roughness={0.5}
        metalness={0.1}
      />
      
      {/* Wireframe on hover/select */}
      {(hovered || isSelected) && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial
            color={isSelected ? '#3b82f6' : '#fff'}
            linewidth={2}
          />
        </lineSegments>
      )}
    </Box>
  );
}
