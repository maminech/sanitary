import { useState } from 'react';
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  FileText,
  Package,
  Receipt,
  Settings,
} from 'lucide-react';
import { Card, Button, Input } from '../components/ui';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { icon: FileText, label: 'Plans', color: 'blue' },
    { icon: Package, label: 'Products', color: 'green' },
    { icon: Receipt, label: 'Quotes', color: 'purple' },
    { icon: Settings, label: 'Account', color: 'indigo' },
  ];

  const faqs = [
    {
      question: 'How do I upload a new plan?',
      answer: 'Navigate to the Plans page and click the "Upload Plan" button. You can upload 2D/3D plans in formats like PDF, DWG, or DXF. Our AI will automatically detect and catalog sanitary products.',
    },
    {
      question: 'How long does plan processing take?',
      answer: 'Most plans are processed within 2-5 minutes. Complex plans with many products may take up to 10 minutes. You\'ll receive a notification when processing is complete.',
    },
    {
      question: 'Can I edit a quote after it\'s created?',
      answer: 'Yes, you can edit quotes in DRAFT status. Once a quote is sent to a client (PENDING status), you can duplicate it to create a revised version.',
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings → Security tab. Enter your current password and your new password twice. Make sure it meets the security requirements.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. You can manage your payment methods in the Billing section of Settings.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Go to Settings → Billing tab and click "Cancel Subscription". Your access will continue until the end of your current billing period.',
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Search our knowledge base or get in touch with support</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <Input
              icon={<Search className="w-5 h-5" />}
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const colors: Record<string, string> = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              indigo: 'bg-indigo-100 text-indigo-600',
            };
            return (
              <Card key={category.label} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-lg ${colors[category.color]} mb-3`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.label}</h3>
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQs */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left py-2 hover:text-blue-600 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="mt-2 text-gray-600 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4 text-sm">Chat with our support team in real-time</p>
            <Button variant="outline" size="sm">Start Chat</Button>
          </Card>

          <Card className="text-center">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4 text-sm">We'll respond within 24 hours</p>
            <Button variant="outline" size="sm">Send Email</Button>
          </Card>

          <Card className="text-center">
            <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
              <Phone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4 text-sm">Mon-Fri, 9AM-6PM EST</p>
            <Button variant="outline" size="sm">Call Now</Button>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="mt-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Book className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">
                Access our comprehensive documentation for detailed guides, API references, and best practices.
              </p>
              <Button variant="outline" size="sm">View Documentation</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
