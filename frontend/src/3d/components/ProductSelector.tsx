/**
 * Product Selector Modal
 * Shows alternative products for replacement
 */

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { DetectedProduct } from '../../services/planService';
import api from '../../services/api';

interface ProductSelectorProps {
  detectedProduct: DetectedProduct;
  onClose: () => void;
  onSelect: (product: any) => void;
}

export default function ProductSelector({ detectedProduct, onClose, onSelect }: ProductSelectorProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProducts();
  }, [detectedProduct]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      
      // If detected product has a linked product, get similar to it
      if (detectedProduct.productId) {
        const response = await api.get(`/products/${detectedProduct.productId}/similar`);
        setProducts([detectedProduct.product, ...response.data.data]);
      } else {
        // Otherwise, search by type
        const response = await api.get('/products', {
          params: {
            type: detectedProduct.type,
            limit: 10,
          },
        });
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch similar products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Select Alternative Product</h2>
            <p className="text-gray-600 mt-1">
              Current: {detectedProduct.name || detectedProduct.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No alternative products found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCurrently={product.id === detectedProduct.productId}
                  onSelect={() => {
                    onSelect(product);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, isCurrently, onSelect }: any) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {isCurrently && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Current
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.reference}</p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {product.description || 'No description'}
        </p>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-blue-600">
            €{product.basePrice.toFixed(2)}
          </div>
          <button
            onClick={onSelect}
            disabled={isCurrently}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isCurrently ? 'Selected' : 'Select'}
          </button>
        </div>

        {/* Supplier */}
        {product.supplier && (
          <div className="text-xs text-gray-500 mt-2">
            by {product.supplier.company || `${product.supplier.firstName} ${product.supplier.lastName}`}
          </div>
        )}
      </div>
    </div>
  );
}
