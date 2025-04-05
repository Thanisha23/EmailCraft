"use client";

import React from "react";
import FlowchartEditor from "@/components/FlowchartEditor";

export default function NewFlowchartPage() {

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <FlowchartEditor />
    </main>
  );
}