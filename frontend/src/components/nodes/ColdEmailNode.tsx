import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ColdEmailNodeData } from "@/types/flowchart";
import { Mail, Check, Clock } from "lucide-react";

export default function ColdEmailNode({
  data,
  isConnectable,
}: NodeProps<ColdEmailNodeData>) {
  const [status, setStatus] = useState<"pending" | "scheduled" | "none">(
    "none"
  );

  useEffect(() => {
    if (data.subject && data.body) {
      setStatus("pending");
      const timer = setTimeout(() => {
        setStatus("scheduled");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setStatus("none");
    }
  }, [data.subject, data.body]);

  return (
    <div className="bg-white border-2 border-indigo-500 rounded-lg p-3 shadow-md w-64">
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 top-[-5px]"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 left-[-5px]"
      />

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-indigo-500 mr-2" />
            <div className="font-semibold text-indigo-900">Cold Email</div>
          </div>

          {status === "scheduled" && (
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Scheduled
            </div>
          )}

          {status === "pending" && (
            <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1 animate-spin" />
              Pending
            </div>
          )}
        </div>

        <div className="p-2 bg-indigo-50 rounded-md">
          {data.subject && (
            <div className="text-sm text-indigo-700 mb-1 flex items-start">
              <span className="font-medium mr-1 min-w-14">Subject:</span>
              <span className="truncate">{data.subject}</span>
            </div>
          )}

          {data.body && (
            <div className="mt-2">
              <div className="text-xs font-medium text-indigo-700 mb-1">
                Message:
              </div>
              <div className="text-xs bg-white p-2 rounded border border-indigo-100 max-h-16 overflow-y-auto text-indigo-900">
                {data.body.length > 100
                  ? data.body.substring(0, 100) + "..."
                  : data.body}
              </div>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 bottom-[-5px]"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 right-[-5px]"
      />
    </div>
  );
}
