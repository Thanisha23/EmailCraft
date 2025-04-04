"use client";

import React, { useState, useEffect } from "react";
import { getFlowcharts } from "@/service/api";
import Link from "next/link";
import FlowchartEditor from "@/components/FlowchartEditor";
import { FlowchartData } from "@/types/flowchart";
import { useAuth } from "@/context/AuthContext";
import { 
  LogOut, 
  ArrowLeft, 
  PlusCircle, 
  Loader, 
  BarChart3, 
  Calendar, 
  Grid3X3
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [flowcharts, setFlowcharts] = useState<FlowchartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewFlowchart, setShowNewFlowchart] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchFlowcharts = async () => {
      try {
        const response = await getFlowcharts();
        if (response.flowcharts && Array.isArray(response.flowcharts)) {
          setFlowcharts(response.flowcharts);
        } else {
          setFlowcharts([]);
          console.warn("API returned non-array flowcharts:", response);
        }
      } catch (error) {
        console.error("Error fetching flowcharts:", error);
        toast.error("Failed to load flowchart");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowcharts();
  }, []);

  if (showNewFlowchart) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="p-4 border-b border-indigo-100 bg-white flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold text-indigo-900">EmailCraft Designer</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowNewFlowchart(false)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={logout}
              className="flex items-center text-red-600 hover:text-red-800 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
        <FlowchartEditor />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">
              EC
            </div>
            <h1 className="text-2xl font-bold text-indigo-900">EmailCraft</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-white border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100 mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-indigo-900">Your Email Flowcharts</h2>
              <button
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm"
                onClick={() => setShowNewFlowchart(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Flowchart
              </button>
            </div>

            {loading ? (
              <div className="text-center p-16 flex flex-col items-center">
                <Loader className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                <p className="text-indigo-700">Loading your flowcharts...</p>
              </div>
            ) : flowcharts.length === 0 ? (
              <div className="text-center p-16 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <div className="flex justify-center mb-4">
                  <Grid3X3 className="h-16 w-16 text-indigo-300" />
                </div>
                <h3 className="text-lg font-medium text-indigo-900 mb-2">No flowcharts yet</h3>
                <p className="text-indigo-700 mb-6">Create your first email flowchart to get started</p>
                <button
                  className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm flex items-center mx-auto"
                  onClick={() => setShowNewFlowchart(true)}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Your First Flowchart
                </button>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {flowcharts.map((flowchart) => (
                  <Link 
                    href={`/home/flowchart/${flowchart._id}`}
                    key={flowchart._id || `flowchart-${Math.random()}`}
                    className="block bg-white border-2 border-indigo-100 rounded-lg overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all transform hover:-translate-y-1"
                  >
                    <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                      <h3 className="font-medium text-indigo-900 truncate">{flowchart.name}</h3>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-indigo-600 space-y-2">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Nodes: {flowchart.nodes?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Updated: {flowchart.updatedAt ? new Date(flowchart.updatedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-sm text-indigo-500">
          &copy; {new Date().getFullYear()} EmailCraft. All rights reserved.
        </div>
      </div>
    </main>
  );
}