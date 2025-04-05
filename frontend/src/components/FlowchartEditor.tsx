"use client";

import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Panel,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  saveFlowchart,
  getFlowchartById,
  updateFlowchart,
  processFlowchart,
} from "@/service/api";
import NodeConfigPanel from "./NodeConfigPanel";
import ColdEmailNode from "./nodes/ColdEmailNode";
import WaitDelayNode from "./nodes/WaitDelayNode";
import LeadSourceNode from "./nodes/LeadSourceNode";
import FlowchartsList from "./FlowchartsList";
import {
  NodeData,
  ColdEmailNodeData,
  WaitDelayNodeData,
  LeadSourceNodeData,
  FlowchartData,
} from "@/types/flowchart";
import {
  Mail,
  Clock,
  Users,
  Save,
  Loader,
  X,
  PlusCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const customNodeTypes: NodeTypes = {
  coldEmail: ColdEmailNode,
  delay: WaitDelayNode,
  leadSource: LeadSourceNode,
};

interface FlowchartEditorProps {
  flowchartId?: string;
}

export default function FlowchartEditor({ flowchartId }: FlowchartEditorProps) {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeId, setNodeId] = useState(1);
  const [flowchartName, setFlowchartName] = useState("Untitled Flowchart");
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFlowcharts, setShowSavedFlowcharts] = useState(false);

  useEffect(() => {
    if (flowchartId) {
      const loadFlowchart = async () => {
        try {
          const response = await getFlowchartById(flowchartId);

          if (
            response &&
            response.flowchart &&
            typeof response.flowchart === "object" &&
            "name" in response.flowchart &&
            "nodes" in response.flowchart &&
            "edges" in response.flowchart &&
            Array.isArray(response.flowchart.nodes) &&
            Array.isArray(response.flowchart.edges)
          ) {
            const flowchart = response.flowchart as FlowchartData;

            setFlowchartName(flowchart.name);

            const processedNodes = flowchart.nodes.map((node) => {
              if (node.type === "leadSource" && node.data) {
                if (
                  node.type === "leadSource" &&
                  "emailList" in node.data &&
                  !Array.isArray((node.data as LeadSourceNodeData).emailList)
                ) {
                  if (typeof node.data.emailList === "string") {
                    node.data.emailList = node.data.emailList
                      .split(",")
                      .map((email) => email.trim());
                  } else {
                    node.data.emailList = [];
                  }
                } else if (
                  node.type === "leadSource" &&
                  !(node.data as LeadSourceNodeData).emailList
                ) {
                  (node.data as LeadSourceNodeData).emailList = [];
                }
              }
              return node;
            });

            setNodes(processedNodes as Node<NodeData>[]);
            setEdges(flowchart.edges as Edge[]);

            if (flowchart.nodes.length > 0) {
              const nodeIds = flowchart.nodes.map((node) =>
                node.id && /^\d+$/.test(node.id) ? parseInt(node.id) : 0
              );
              const highestId = Math.max(...nodeIds, 0);
              setNodeId(highestId + 1);
            }
          } else {
            console.warn(
              "API response doesn't have the expected structure:",
              response
            );
          }
        } catch (error) {
          console.error("Failed to load flowchart:", error);
          toast.error("Failed to load flowchart");
        }
      };

      loadFlowchart();
    }
  }, [flowchartId]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    []
  );

  const addNode = (type: string) => {
    let nodeType = "default";
    let initialData: NodeData = {
      nodeType: "coldEmail",
      label: type,
    };

    switch (type) {
      case "Cold Email":
        nodeType = "coldEmail";
        initialData = {
          label: type,
          nodeType: "coldEmail",
          subject: "",
          body: "",
          to: "",
        } as ColdEmailNodeData;
        break;
      case "Wait/Delay":
        nodeType = "delay";
        initialData = {
          label: type,
          nodeType: "delay",
          delayHours: 1,
          delayMinutes: 0,
        } as WaitDelayNodeData;
        break;
      case "Lead Source":
        nodeType = "leadSource";
        initialData = {
          label: type,
          nodeType: "leadSource",
          source: "Manual Input",
          emailList: [],
        } as LeadSourceNodeData;
        break;
    }

    const newNode: Node<NodeData> = {
      id: `${nodeId}`,
      type: nodeType,
      data: initialData,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeId((prevId) => prevId + 1);
  };

  const updateNodeData = (
    nodeId: string,
    newData: Partial<
      NodeData | ColdEmailNodeData | WaitDelayNodeData | LeadSourceNodeData
    >
  ) => {
    setNodes(
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  };

  const closeNodeConfig = () => {
    setSelectedNode(null);
  };
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));

    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    setSelectedNode(null);

    toast.error("Node deleted", {
      position: "top-right",
      duration: 3000,
    });
  }, []);


const handleSaveFlowchart = async () => {
  setIsSaving(true);
  try {
    const flowchartData: FlowchartData = {
      name: flowchartName,
      nodes,
      edges,
    };

    let savedFlowchartId = flowchartId;

    if (flowchartId) {
      await updateFlowchart(flowchartId, flowchartData);
    } else {
      const response = await saveFlowchart(flowchartData);
      if (
        response &&
        response.flowchart &&
        typeof response.flowchart === "object" &&
        "_id" in response.flowchart &&
        typeof response.flowchart._id === "string"
      ) {
        savedFlowchartId = response.flowchart._id;
      }
    }
    const hasLeadSource = nodes.some(
      (node) =>
        node.type === "leadSource" &&
        (node.data as LeadSourceNodeData).emailList &&
        Array.isArray((node.data as LeadSourceNodeData).emailList) &&
        (node.data as LeadSourceNodeData).emailList.length > 0
    );

    const hasEmailNode = nodes.some((node) => {
      if (node.type === "coldEmail") {
        const data = node.data as ColdEmailNodeData;
        return Boolean(data.subject && data.body);
      }
      return false;
    });

    const hasValidConnection = edges.some(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      return (
        sourceNode?.type === "leadSource" && 
        targetNode?.type === "coldEmail"
      ) || (
        sourceNode?.type === "leadSource" && 
        targetNode?.type === "delay" && 
        edges.some(e2 => {
          const delayTarget = nodes.find(n => n.id === e2.target);
          return e2.source === edge.target && delayTarget?.type === "coldEmail";
        })
      );
    });

    if (hasLeadSource && hasEmailNode && hasValidConnection) {
      toast.success("Flowchart saved successfully!");
      
      if (savedFlowchartId) {
        try {
          await processFlowchart(savedFlowchartId);
          toast.success("Emails have been scheduled based on your flowchart!");
        } catch (error) {
          console.error("Error processing flowchart for emails:", error);
          toast.error("Failed to process flowchart for emails");
        }
      }
    } else {
      if (!hasLeadSource && !hasEmailNode) {
        toast.success("Flowchart saved! Add lead sources and emails to enable automation.");
      } else if (!hasLeadSource) {
        toast.success("Flowchart saved! Add a lead source with emails to enable automation.");
      } else if (!hasEmailNode) {
        toast.success("Flowchart saved! Add an email node to enable automation.");
      } else if (!hasValidConnection) {
        toast.success("Flowchart saved! Connect your lead source to an email to enable automation.");
      } else {
        toast.success("Flowchart saved successfully!");
      }
      
     
      if (!flowchartId && !hasLeadSource && !hasEmailNode) {
        setTimeout(() => {
          window.location.href = "/home";
        }, 1500);
      }
    }
  } catch (error) {
    console.error("Error saving flowchart:", error);
    toast.error("Failed to save flowchart");
  } finally {
    setIsSaving(false);
  }
};
  const toggleSavedFlowcharts = () => {
    setShowSavedFlowcharts(!showSavedFlowcharts);
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "Cold Email":
        return <Mail className="h-4 w-4 mr-2" />;
      case "Wait/Delay":
        return <Clock className="h-4 w-4 mr-2" />;
      case "Lead Source":
        return <Users className="h-4 w-4 mr-2" />;
      default:
        return <PlusCircle className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 mb-6">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            {/* Left side */}
            <div className="w-full md:w-auto md:flex-shrink-0 md:mr-4">
              <input
                type="text"
                value={flowchartName}
                onChange={(e) => setFlowchartName(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/50 text-indigo-900"
                placeholder="Flowchart Name"
              />
            </div>

            <div className="flex flex-nowrap pb-2 md:pb-0 -mx-1 md:mx-0 overflow-x-hidden
">
              {["Cold Email", "Wait/Delay", "Lead Source"].map((type) => (
                <button
                  key={type}
                  className="flex-shrink-0 flex items-center px-3 py-2 mx-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-sm whitespace-nowrap cursor-pointer"
                  onClick={() => addNode(type)}
                >
                  {getNodeTypeIcon(type)}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 md:flex-shrink-0 pt-2">
            <button
              className="flex items-center px-3 py-2 border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 whitespace-nowrap cursor-pointer"
              onClick={toggleSavedFlowcharts}
            >
              {showSavedFlowcharts ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showSavedFlowcharts ? "Hide" : "Show"} Flowcharts
            </button>

            <button
              className={`flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg  hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 whitespace-nowrap ${
                isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleSaveFlowchart}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        {showSavedFlowcharts && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
              <div className="p-4 border-b border-indigo-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-indigo-900">
                  Saved Flowcharts
                </h2>
                <button
                  onClick={() => setShowSavedFlowcharts(false)}
                  className="text-indigo-500 cursor-pointer hover:text-indigo-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <FlowchartsList
                  onSelect={() => setShowSavedFlowcharts(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={customNodeTypes}
            fitView
            className="bg-indigo-50/30"
          >
            <MiniMap
              className="bg-white border border-indigo-100 rounded-lg shadow-sm"
              nodeColor={(n) => {
                switch (n.type) {
                  case "coldEmail":
                    return "#4f46e5";
                  case "delay":
                    return "#7c3aed";
                  case "leadSource":
                    return "#2563eb";
                  default:
                    return "#6366f1";
                }
              }}
            />
            <Controls className="bg-white border border-indigo-100 rounded-lg shadow-sm" />
            <Background color="#c7d2fe" gap={16} />

            <Panel
              position="top-right"
              className="bg-white p-3 rounded-lg shadow-md border border-indigo-100"
            >
              <div className="text-sm text-indigo-900">
                <div className="flex items-center mb-1">
                  <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></div>
                  <p>Nodes: {nodes.length}</p>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-indigo-400 mr-2"></div>
                  <p>Connections: {edges.length}</p>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {selectedNode && (
          <div className="fixed inset-0 bg-indigo-900/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100 w-full max-w-lg">
              <div className="p-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50">
                <h2 className="text-lg font-semibold text-indigo-900">
                  Edit Node
                </h2>
                <button
                  onClick={closeNodeConfig}
                  className="text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NodeConfigPanel
                node={selectedNode}
                onUpdate={updateNodeData}
                onClose={closeNodeConfig}
                onDelete={handleDeleteNode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
