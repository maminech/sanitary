import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  Package,
  AlertCircle,
  Grid3x3,
  List,
  Download,
  Tag,
} from 'lucide-react';
import {
  getProducts,
  Product,
  ProductFilters as IProductFilters,
} from '../../services/productService';
import { Loader, EmptyState, Card, Badge, Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

const PRODUCT_TYPES = [
  'ALL',
  'SINK',
  'TOILET',
  'BATHTUB',
  'SHOWER',
  'FAUCET',
  'BIDET',
  'URINAL',
  'ACCESSORY',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<IProductFilters>({
    search: '',
    type: '',
    inStock: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          p.sku.toLowerCase().includes(filters.search!.toLowerCase()) ||
          p.brand?.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((p) => p.type === filters.type);
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice <= filters.maxPrice!);
    }

    setFilteredProducts(filtered);
  };

  const updateFilter = (key: keyof IProductFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Catalog</h1>
              <p className="text-gray-600">
                Browse our comprehensive collection of sanitary products
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" icon={<Download className="w-5 h-5" />}>
                Export
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <StatCard
              label="Total Products"
              value={products.length}
              icon={Package}
              color="blue"
            />
            <StatCard
              label="In Stock"
              value={products.filter((p) => p.stock > 0).length}
              icon={Tag}
              color="green"
            />
            <StatCard
              label="Low Stock"
              value={products.filter((p) => p.stock <= p.minStock && p.stock > 0).length}
              icon={AlertCircle}
              color="yellow"
            />
            <StatCard
              label="Out of Stock"
              value={products.filter((p) => p.stock === 0).length}
              icon={AlertCircle}
              color="red"
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            {/* Search */}
            <Input
              icon={<Search className="w-5 h-5" />}
              placeholder="Search by name, SKU, or brand..."
              value={filters.search}
              onChange={(e: any) => updateFilter('search', e.target.value)}
            />

            {/* Filter Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1">
                {/* Type Filter */}
                <select
                  value={filters.type || 'ALL'}
                  onChange={(e) =>
                    updateFilter('type', e.target.value === 'ALL' ? '' : e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === 'ALL' ? 'All Types' : type}
                    </option>
                  ))}
                </select>

                {/* Stock Filter */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                </label>

                {/* Price Range */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min €"
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max €"
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </Card>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="w-16 h-16 text-gray-400" />}
            title="No products found"
            description="Try adjusting your filters or search query"
            action={{
              label: 'Clear Filters',
              onClick: () =>
                setFilters({
                  search: '',
                  type: '',
                  inStock: undefined,
                  minPrice: undefined,
                  maxPrice: undefined,
                }),
            }}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProducts.map((product) =>
              viewMode === 'grid' ? (
                <ProductGridCard key={product._id} product={product} />
              ) : (
                <ProductListCard key={product._id} product={product} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`p-4 rounded-lg ${colors[color]} flex items-center gap-4`}>
      <Icon className="w-8 h-8" />
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

// Component: Product Grid Card
function ProductGridCard({ product }: { product: Product }) {
  const isLowStock = product.stock <= product.minStock && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/products/${product._id}`}>
      <Card hover padding={false} className="overflow-hidden h-full">
        {/* Image */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-16 h-16 text-gray-400" />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning">Low Stock</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="info" size="sm">
              {product.type}
            </Badge>
            <span className="text-xs text-gray-500">{product.sku}</span>
          </div>

          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          {product.brand && (
            <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          )}

          {/* Price & Stock */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                €{product.basePrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{product.currency}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{product.stock} units</p>
              <p className="text-xs text-gray-500">in stock</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Component: Product List Card
function ProductListCard({ product }: { product: Product }) {
  const isLowStock = product.stock <= product.minStock && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/products/${product._id}`}>
      <Card hover className="flex items-center gap-6">
        {/* Image */}
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Package className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="info" size="sm">
              {product.type}
            </Badge>
            <span className="text-xs text-gray-500">{product.sku}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
          {product.brand && <p className="text-sm text-gray-600">{product.brand}</p>}
          {product.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-1">{product.description}</p>
          )}
        </div>

        {/* Price & Stock */}
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-blue-600 mb-1">
            €{product.basePrice.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 justify-end">
            {isOutOfStock ? (
              <Badge variant="error">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">Low Stock ({product.stock})</Badge>
            ) : (
              <Badge variant="success">{product.stock} in stock</Badge>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          <Button variant="outline" icon={<Eye className="w-4 h-4" />}>
            Details
          </Button>
        </div>
      </Card>
    </Link>
  );
}
