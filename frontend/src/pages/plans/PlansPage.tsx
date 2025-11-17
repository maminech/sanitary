import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Search,
  Eye,
  Trash2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader as LoaderIcon,
  Grid3x3,
  List,
  Plus,
} from 'lucide-react';
import { getPlans, uploadPlan, deletePlan, Plan } from '../../services/planService';
import { Loader, EmptyState, Card, Badge, Button, Input, Modal } from '../../components/ui';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'ALL' | 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [plans, searchQuery, filterStatus]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
    } catch (error) {
      toast.error('Failed to load plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = [...plans];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((plan) => plan.status === filterStatus);
    }

    setFilteredPlans(filtered);
  };

  const handleUpload = async (file: File, metadata: any) => {
    try {
      setUploading(true);
      await uploadPlan(file, metadata);
      toast.success('Plan uploaded successfully!');
      setUploadModalOpen(false);
      loadPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await deletePlan(id);
      toast.success('Plan deleted');
      loadPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Building Plans</h1>
              <p className="text-gray-600">
                Upload and manage your 2D/3D architectural plans
              </p>
            </div>
            <Button
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setUploadModalOpen(true)}
              size="lg"
            >
              Upload Plan
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <StatCard label="Total Plans" value={plans.length} color="blue" />
            <StatCard
              label="Processing"
              value={plans.filter((p) => p.status === 'PROCESSING').length}
              color="yellow"
            />
            <StatCard
              label="Completed"
              value={plans.filter((p) => p.status === 'COMPLETED').length}
              color="green"
            />
            <StatCard
              label="Failed"
              value={plans.filter((p) => p.status === 'FAILED').length}
              color="red"
            />
          </div>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                icon={<Search className="w-5 h-5" />}
                placeholder="Search plans by name or description..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
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
          </div>
        </Card>

        {/* Plans List/Grid */}
        {filteredPlans.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-16 h-16 text-gray-400" />}
            title="No plans found"
            description="Upload your first architectural plan to get started with product detection and quotations"
            action={{
              label: 'Upload Plan',
              onClick: () => setUploadModalOpen(true),
            }}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredPlans.map((plan) =>
              viewMode === 'grid' ? (
                <PlanGridCard
                  key={plan._id || plan.id}
                  plan={plan}
                  onDelete={() => handleDelete(plan._id || plan.id)}
                />
              ) : (
                <PlanListCard
                  key={plan._id || plan.id}
                  plan={plan}
                  onDelete={() => handleDelete(plan._id || plan.id)}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadPlanModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
          uploading={uploading}
        />
      )}
    </div>
  );
}

// Component: Stat Card
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`p-4 rounded-lg ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

// Component: Plan Grid Card
function PlanGridCard({ plan, onDelete }: { plan: Plan; onDelete: () => void }) {
  const statusConfig: Record<string, { icon: any; color: string; badge: any }> = {
    UPLOADED: { icon: Clock, color: 'text-gray-600', badge: 'default' },
    PROCESSING: { icon: LoaderIcon, color: 'text-yellow-600', badge: 'warning' },
    COMPLETED: { icon: CheckCircle, color: 'text-green-600', badge: 'success' },
    FAILED: { icon: XCircle, color: 'text-red-600', badge: 'error' },
  };

  const config = statusConfig[plan.status];
  const StatusIcon = config.icon;

  return (
    <Card hover padding={false} className="overflow-hidden">
      {/* Preview */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
        <FileText className="w-16 h-16 text-blue-600 opacity-50" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg truncate flex-1">
            {plan.name}
          </h3>
          <Badge variant={config.badge as any}>{plan.status}</Badge>
        </div>

        {plan.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <StatusIcon className={`w-4 h-4 ${config.color}`} />
            <span>{plan.fileType}</span>
          </div>
          <div>{(plan.fileSize / 1024 / 1024).toFixed(2)} MB</div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/plans/${plan._id || plan.id}`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
          >
            <Eye className="w-4 h-4 inline mr-2" />
            View
          </Link>
          <button
            onClick={onDelete}
            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
}

// Component: Plan List Card
function PlanListCard({ plan, onDelete }: { plan: Plan; onDelete: () => void }) {
  const statusConfig: Record<string, { icon: any; badge: any }> = {
    UPLOADED: { icon: Clock, badge: 'default' },
    PROCESSING: { icon: LoaderIcon, badge: 'warning' },
    COMPLETED: { icon: CheckCircle, badge: 'success' },
    FAILED: { icon: XCircle, badge: 'error' },
  };

  const config = statusConfig[plan.status];
  const StatusIcon = config.icon;

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{plan.fileType}</span>
            <span>{(plan.fileSize / 1024 / 1024).toFixed(2)} MB</span>
            <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Badge variant={config.badge as any}>
          <StatusIcon className="w-4 h-4 inline mr-1" />
          {plan.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Link
          to={`/plans/${plan._id || plan.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </Link>
        <button
          onClick={onDelete}
          className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
}

// Component: Upload Plan Modal
function UploadPlanModal({
  isOpen,
  onClose,
  onUpload,
  uploading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, metadata: any) => void;
  uploading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    buildingType: '',
    floor: '',
    area: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!metadata.name) {
        setMetadata({ ...metadata, name: selectedFile.name.replace(/\.[^/.]+$/, '') });
      }
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if (!metadata.name) {
      toast.error('Please enter a plan name');
      return;
    }
    onUpload(file, metadata);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload New Plan"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={uploading} disabled={!file}>
            Upload Plan
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan File <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.dwg,.dxf,.ifc,.png,.jpg,.jpeg"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Choose file
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, DWG, DXF, IFC, PNG, JPG (Max 100MB)
            </p>
            {file && (
              <p className="text-sm text-gray-700 mt-2 font-medium">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <Input
          label="Plan Name"
          required
          value={metadata.name}
          onChange={(e: any) => setMetadata({ ...metadata, name: e.target.value })}
          placeholder="e.g., Ground Floor Plan"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Optional description..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Building Type"
            value={metadata.buildingType}
            onChange={(e: any) => setMetadata({ ...metadata, buildingType: e.target.value })}
            placeholder="e.g., Residential"
          />
          <Input
            label="Floor"
            value={metadata.floor}
            onChange={(e: any) => setMetadata({ ...metadata, floor: e.target.value })}
            placeholder="e.g., Ground"
          />
          <Input
            label="Area (m²)"
            type="number"
            value={metadata.area}
            onChange={(e: any) => setMetadata({ ...metadata, area: e.target.value })}
            placeholder="e.g., 150"
          />
        </div>
      </div>
    </Modal>
  );
}
