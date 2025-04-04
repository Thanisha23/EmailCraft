import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { LeadSourceNodeData } from "@/types/flowchart";
import { Users, Database } from "lucide-react";

export default function LeadSourceNode({
  data,
  isConnectable,
}: NodeProps<LeadSourceNodeData>) {
  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-md w-64">
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 top-[-5px]"
      />

      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <Users className="h-5 w-5 text-blue-500 mr-2" />
          <div className="font-semibold text-indigo-900">Lead Source</div>
        </div>

        <div className="p-2 bg-indigo-50 rounded-md">
          {data.source && (
            <div className="flex items-center text-sm text-indigo-700 mb-1">
              <Database className="h-4 w-4 text-indigo-400 mr-1" />
              <span className="font-medium mr-1">Source:</span> {data.source}
            </div>
          )}

          {data.emailList && (
            <div className="text-sm text-indigo-700">
              <span className="font-medium mr-1">Emails:</span>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">
                {data.emailList.length}
              </span>
            </div>
          )}

          {data.emailList && data.emailList.length > 0 && (
            <div className="mt-2 text-xs text-indigo-500 max-h-20 overflow-y-auto bg-white p-1 rounded border border-indigo-100">
              {data.emailList.slice(0, 3).map((email, index) => (
                <div key={index} className="truncate">
                  {email}
                </div>
              ))}
              {data.emailList.length > 3 && (
                <div className="text-indigo-400 italic">
                  +{data.emailList.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 bottom-[-5px]"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 right-[-5px]"
      />
    </div>
  );
}
