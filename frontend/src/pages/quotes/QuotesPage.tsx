import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Receipt,
  Plus,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Trash2,
} from 'lucide-react';
import {
  getQuotes,
  deleteQuote,
  updateQuoteStatus,
  Quote,
} from '../../services/quoteService';
import { Loader, EmptyState, Card, Badge, Button, Input, Modal } from '../../components/ui';
import toast from 'react-hot-toast';

type QuoteStatus = 'ALL' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

const STATUS_CONFIG: Record<
  string,
  { icon: any; color: string; badge: any; label: string }
> = {
  DRAFT: { icon: FileText, color: 'text-gray-600', badge: 'default', label: 'Draft' },
  PENDING: { icon: Clock, color: 'text-yellow-600', badge: 'warning', label: 'Pending' },
  APPROVED: { icon: CheckCircle, color: 'text-green-600', badge: 'success', label: 'Approved' },
  REJECTED: { icon: XCircle, color: 'text-red-600', badge: 'error', label: 'Rejected' },
  EXPIRED: { icon: AlertCircle, color: 'text-orange-600', badge: 'warning', label: 'Expired' },
};

export default function QuotesPage() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quotes, searchQuery, statusFilter]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await getQuotes();
      setQuotes(data);
    } catch (error) {
      toast.error('Failed to load quotes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...quotes];

    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredQuotes(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      await deleteQuote(id);
      toast.success('Quote deleted');
      loadQuotes();
    } catch (error) {
      toast.error('Failed to delete quote');
    }
  };

  const handleStatusChange = async (id: string, status: Quote['status']) => {
    try {
      await updateQuoteStatus(id, status);
      toast.success(`Quote ${status.toLowerCase()}`);
      setStatusModalOpen(false);
      loadQuotes();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const calculateTotalRevenue = () => {
    return quotes
      .filter((q) => q.status === 'APPROVED')
      .reduce((sum, q) => sum + q.totalAmount, 0);
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Quotations</h1>
              <p className="text-gray-600">Create and manage your project quotations</p>
            </div>
            <Button
              icon={<Plus className="w-5 h-5" />}
              onClick={() => navigate('/quotes/create')}
              size="lg"
            >
              Create Quote
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <StatCard
              label="Total Quotes"
              value={quotes.length}
              icon={Receipt}
              color="blue"
            />
            <StatCard
              label="Pending"
              value={quotes.filter((q) => q.status === 'PENDING').length}
              icon={Clock}
              color="yellow"
            />
            <StatCard
              label="Approved"
              value={quotes.filter((q) => q.status === 'APPROVED').length}
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              label="Rejected"
              value={quotes.filter((q) => q.status === 'REJECTED').length}
              icon={XCircle}
              color="red"
            />
            <StatCard
              label="Total Revenue"
              value={`€${(calculateTotalRevenue() / 1000).toFixed(1)}k`}
              icon={DollarSign}
              color="emerald"
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                icon={<Search className="w-5 h-5" />}
                placeholder="Search by quote number, title, or client..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as QuoteStatus)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <Button variant="outline" icon={<Download className="w-5 h-5" />}>
              Export
            </Button>
          </div>
          <div className="text-sm text-gray-600 mt-3">
            Showing {filteredQuotes.length} of {quotes.length} quotes
          </div>
        </Card>

        {/* Quotes List */}
        {filteredQuotes.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-16 h-16 text-gray-400" />}
            title="No quotes found"
            description="Create your first quotation to start generating revenue"
            action={{
              label: 'Create Quote',
              onClick: () => navigate('/quotes/create'),
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <QuoteCard
                key={quote._id}
                quote={quote}
                onDelete={() => handleDelete(quote._id)}
                onStatusChange={(_status) => {
                  setSelectedQuote(quote);
                  setStatusModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {statusModalOpen && selectedQuote && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title="Update Quote Status"
          footer={
            <Button variant="ghost" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
          }
        >
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">
              Update status for quote <strong>{selectedQuote.quoteNumber}</strong>
            </p>
            {(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(selectedQuote._id, status)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  {STATUS_CONFIG[status] && (
                    <>
                      {(() => {
                        const Icon = STATUS_CONFIG[status].icon;
                        return <Icon className={`w-6 h-6 ${STATUS_CONFIG[status].color}`} />;
                      })()}
                      <div>
                        <p className="font-semibold">{STATUS_CONFIG[status].label}</p>
                        <p className="text-sm text-gray-500">
                          {status === 'DRAFT' && 'Save as draft for later'}
                          {status === 'PENDING' && 'Send to client for review'}
                          {status === 'APPROVED' && 'Mark as approved and confirmed'}
                          {status === 'REJECTED' && 'Mark as rejected'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
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
  value: number | string;
  icon: any;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className={`p-4 rounded-lg ${colors[color]} flex items-center gap-3`}>
      <Icon className="w-8 h-8" />
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

// Component: Quote Card
function QuoteCard({
  quote,
  onDelete,
  onStatusChange,
}: {
  quote: Quote;
  onDelete: () => void;
  onStatusChange: (status: Quote['status']) => void;
}) {
  const config = STATUS_CONFIG[quote.status];
  const StatusIcon = config.icon;

  const isExpired =
    quote.validUntil && new Date(quote.validUntil) < new Date() && quote.status === 'PENDING';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-6">
        {/* Icon */}
        <div className={`p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50`}>
          <Receipt className="w-8 h-8 text-blue-600" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{quote.title}</h3>
            <Badge variant={config.badge as any}>
              <StatusIcon className="w-4 h-4 inline mr-1" />
              {config.label}
            </Badge>
            {isExpired && <Badge variant="error">Expired</Badge>}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="font-medium text-blue-600">{quote.quoteNumber}</span>
            {quote.clientName && (
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {quote.clientName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(quote.createdAt).toLocaleDateString()}
            </span>
            <span>{quote.items.length} items</span>
          </div>

          {quote.description && (
            <p className="text-sm text-gray-500 line-clamp-1">{quote.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-bold text-gray-900">
            €{quote.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Subtotal: €{quote.subtotal.toFixed(2)}
          </p>
          {quote.taxAmount > 0 && (
            <p className="text-xs text-gray-500">Tax: €{quote.taxAmount.toFixed(2)}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to={`/quotes/${quote._id}`}>
            <Button variant="outline" icon={<Eye className="w-4 h-4" />}>
              View
            </Button>
          </Link>
          <button
            onClick={() => onStatusChange(quote.status)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Change Status"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
