import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFlowcharts, deleteFlowchart } from "@/service/api";
import { FlowchartData } from "@/types/flowchart";
import { Calendar, Trash2, Loader, FileText, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";

interface FlowchartsListProps {
  onSelect: () => void;
}

export default function FlowchartsList({ onSelect }: FlowchartsListProps) {
  const [flowcharts, setFlowcharts] = useState<FlowchartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFlowcharts = async () => {
      try {
        setLoading(true);
        const response = await getFlowcharts();
        if (response.flowcharts && Array.isArray(response.flowcharts)) {
          setFlowcharts(response.flowcharts);
        } else {
          setFlowcharts([]);
          console.warn("API returned non-array flowcharts:", response);
        }
      } catch (error) {
        console.error("Error fetching flowcharts:", error);
        setError("Failed to load flowcharts");
        toast.error("Failed to load flowcharts");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowcharts();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.custom((t) => (
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <h3 className="text-xl font-semibold text-indigo-900 mb-3">Confirm Deletion</h3>
        <p className="text-indigo-700 mb-6">Are you sure you want to delete this flowchart? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => toast.dismiss(t)}
            className="px-4 py-2 border-2 border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t);
              toast.promise(
                deleteFlowchart(id).then(() => {
                  setFlowcharts(flowcharts.filter((flowchart) => flowchart._id !== id));
                }),
                {
                  loading: 'Deleting flowchart...',
                  success: 'Flowchart deleted successfully',
                  error: 'Failed to delete flowchart',
                }
              );
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleSelect = (id: string | undefined) => {
    if (id) {
      router.push(`/home/flowchart/${id}`);
      onSelect();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-indigo-700">Loading your flowcharts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (flowcharts.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
        <div className="flex justify-center mb-4">
          <FileText className="h-16 w-16 text-indigo-300" />
        </div>
        <h3 className="text-lg font-medium text-indigo-900 mb-2">No flowcharts found</h3>
        <p className="text-indigo-700 mb-6">Create your first email flowchart to get started</p>
        <button
          onClick={() => onSelect()}
          className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm flex items-center mx-auto cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Flowchart
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-900">Your Flowcharts</h3>
      </div>
      <div className="divide-y divide-indigo-100">
        {flowcharts.map((flowchart) => (
          <div
            key={flowchart._id || `flowchart-${Math.random()}`}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-indigo-50/50 transition-colors"
            onClick={() => handleSelect(flowchart._id)}
          >
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-indigo-900">{flowchart.name}</div>
                <div className="text-sm text-indigo-600 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {flowchart.updatedAt 
                      ? new Date(flowchart.updatedAt).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => flowchart._id && handleDelete(flowchart._id, e)}
                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-colors cursor-pointer"
                title="Delete flowchart"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}