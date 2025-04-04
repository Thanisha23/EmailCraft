import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { WaitDelayNodeData } from "@/types/flowchart";
import { Clock } from "lucide-react";

export default function WaitDelayNode({ data, isConnectable }: NodeProps<WaitDelayNodeData>) {
  return (
    <div className="bg-white border-2 border-purple-500 rounded-lg p-3 shadow-md w-64">
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500 top-[-5px]"
      />
      
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500 left-[-5px]"
      />
      
      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 text-purple-500 mr-2" />
          <div className="font-semibold text-indigo-900">Wait/Delay</div>
        </div>
        
        <div className="p-2 bg-indigo-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-indigo-700">
              <span className="font-medium mr-1">Delay Time:</span>
            </div>
            <div className="flex items-center bg-white px-3 py-1 rounded-full border border-purple-200 shadow-sm">
              <div className="text-purple-700 font-medium">
                {data.delayHours}h {data.delayMinutes}m
              </div>
            </div>
          </div>
          
          <div className="mt-3 h-4 bg-indigo-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (data.delayHours * 60 + data.delayMinutes) / 60 * 100)}%` 
              }}
            ></div>
          </div>
          
          <div className="mt-2 flex justify-between text-xs text-indigo-500">
            <span>0h</span>
            <span>12h</span>
            <span>24h</span>
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500 bottom-[-5px]"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="source-right" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500 right-[-5px]"
      />
    </div>
  );
}