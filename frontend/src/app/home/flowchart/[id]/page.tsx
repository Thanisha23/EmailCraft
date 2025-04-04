"use client";

import { useParams } from "next/navigation";
import FlowchartEditor from "@/components/FlowchartEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FlowchartPage() {
  const params = useParams();
  const flowchartId = params?.id as string;

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="p-4 border-b border-indigo-100 bg-white flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">
            EC
          </div>
          <h1 className="text-2xl font-bold text-indigo-900">EmailCraft Designer</h1>
        </div>
        <Link 
          href="/home" 
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50 border-2 border-indigo-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
      <FlowchartEditor flowchartId={flowchartId} />
      
      <div className="p-4 text-center text-sm text-indigo-500 mt-auto">
        &copy; {new Date().getFullYear()} EmailCraft. All rights reserved.
      </div>
    </main>
  );
}