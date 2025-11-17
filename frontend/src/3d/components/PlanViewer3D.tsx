/**
 * 3D Plan Viewer Component
 * Main Three.js scene for visualizing plans and products
 */

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei';
import { DetectedProduct } from '../../services/planService';
import ProductMesh from './ProductMesh';
import ProductSelector from './ProductSelector';

interface PlanViewer3DProps {
  detectedProducts: DetectedProduct[];
  onProductSelect?: (product: DetectedProduct) => void;
}

export default function PlanViewer3D({ detectedProducts, onProductSelect }: PlanViewer3DProps) {
  const [selectedProduct, setSelectedProduct] = useState<DetectedProduct | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const handleProductClick = (product: DetectedProduct) => {
    setSelectedProduct(product);
    setShowAlternatives(true);
    onProductSelect?.(product);
  };

  const handleProductReplace = (detectedProductId: string, newProduct: any) => {
    // Handle product replacement logic
    console.log('Replacing product:', detectedProductId, 'with:', newProduct);
    setShowAlternatives(false);
  };

  return (
    <div className="relative w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -5]} intensity={0.3} />

        {/* Environment */}
        <Environment preset="apartment" />

        {/* Grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#3b82f6"
          fadeDistance={30}
          fadeStrength={1}
          position={[0, 0, 0]}
        />

        {/* Detected Products */}
        {detectedProducts.map((product) => (
          <ProductMesh
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onClick={() => handleProductClick(product)}
          />
        ))}

        {/* Camera Controls */}
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={50}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Product Selector Modal */}
      {showAlternatives && selectedProduct && (
        <ProductSelector
          detectedProduct={selectedProduct}
          onClose={() => setShowAlternatives(false)}
          onSelect={(newProduct) => handleProductReplace(selectedProduct.id, newProduct)}
        />
      )}

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg text-sm">
        <div className="font-semibold mb-1">Controls:</div>
        <div className="text-gray-600 space-y-1">
          <div>• Left Click + Drag: Rotate</div>
          <div>• Right Click + Drag: Pan</div>
          <div>• Scroll: Zoom</div>
          <div>• Click Product: Select & View Alternatives</div>
        </div>
      </div>

      {/* Selected Product Info */}
      {selectedProduct && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedProduct.name || selectedProduct.type}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{selectedProduct.type}</span>
            </div>
            {selectedProduct.confidence && (
              <div className="flex justify-between">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-medium">{(selectedProduct.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
            {selectedProduct.width && (
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium">
                  {selectedProduct.width.toFixed(2)}m × {selectedProduct.depth?.toFixed(2)}m × {selectedProduct.height?.toFixed(2)}m
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
