"use client";

import React, { useState, useEffect } from "react";
import { getFlowcharts } from "@/service/api";
import Link from "next/link";
import { FlowchartData } from "@/types/flowchart";
import { useRouter, usePathname } from "next/navigation";
import { PlusCircle, Loader, BarChart3, Calendar, Grid3X3 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [flowcharts, setFlowcharts] = useState<FlowchartData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
      toast.error("Failed to load flowcharts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname === "/home") {
      fetchFlowcharts();
    }
  }, [pathname]);

  const handleCreateNew = () => {
    router.push("/flowchart/new");
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100 mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-indigo-900">
                Your Email Flowcharts
              </h2>
              <button
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm cursor-pointer"
                onClick={handleCreateNew}
              >
                <PlusCircle className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">
                  Create New Flowchart
                </span>
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
                <h3 className="text-lg font-medium text-indigo-900 mb-2">
                  No flowcharts yet
                </h3>
                <p className="text-indigo-700 mb-6">
                  Create your first email flowchart to get started
                </p>
                <button
                  className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm flex items-center mx-auto cursor-pointer"
                  onClick={handleCreateNew}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Your First Flowchart
                </button>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {flowcharts.map((flowchart) => (
                  <Link
                    href={`/flowchart/${flowchart._id}`}
                    key={flowchart._id || `flowchart-${Math.random()}`}
                    className="block bg-white border-2 border-indigo-100 rounded-lg overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all transform hover:-translate-y-1"
                  >
                    <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                      <h3 className="font-medium text-indigo-900 truncate">
                        {flowchart.name}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-indigo-600 space-y-2">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Nodes: {flowchart.nodes?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>
                            Updated:{" "}
                            {flowchart.updatedAt
                              ? new Date(
                                  flowchart.updatedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}