"use client";

import React from "react";
import { useParams } from "next/navigation";
import FlowchartEditor from "@/components/FlowchartEditor";

export default function FlowchartPage() {
  const params = useParams();
  const flowchartId = params?.id as string;

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
     
      
      <FlowchartEditor flowchartId={flowchartId} />
      
      
    </main>
  );
}