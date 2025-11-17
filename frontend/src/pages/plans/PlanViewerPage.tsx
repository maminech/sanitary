import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlanById } from '../../services/planService';
import PlanViewer3D from '../../3d/components/PlanViewer3D';
import { Loader2 } from 'lucide-react';

export default function PlanViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPlan(id);
    }
  }, [id]);

  const loadPlan = async (planId: string) => {
    try {
      const data = await getPlanById(planId);
      setPlan(data);
    } catch (error) {
      console.error('Failed to load plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold">{plan?.name}</h1>
      </div>
      <div className="flex-1">
        <PlanViewer3D detectedProducts={plan?.detectedProducts || []} />
      </div>
    </div>
  );
}
