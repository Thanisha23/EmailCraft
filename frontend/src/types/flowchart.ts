import { Node, Edge } from 'reactflow';

export interface FlowchartData {
  _id?: string;
  name: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface NodeData {
  label: string;
  nodeType: 'coldEmail' | 'delay' | 'leadSource'; 
}

export interface ColdEmailNodeData extends NodeData {
  nodeType: 'coldEmail'
  to?: string;
  recipientList?: string[];
  subject?: string;
  body?: string;
}

export interface WaitDelayNodeData extends NodeData {
  nodeType: 'delay'
  delayHours: number;
  delayMinutes: number;
}

export interface LeadSourceNodeData extends NodeData {
  nodeType: 'leadSource'
  source: string;
  emailList: string[];
  apiKey?:string;
  apiEndpoint?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  date: string;
}

export interface ApiResponse<T> {
  message: string;
  [key: string]: unknown | T;
}

export type FlowchartResponse = ApiResponse<{
  flowchart: FlowchartData & {
    _id: string;
  };
}>;

export type FlowchartsResponse = ApiResponse<{
  flowcharts: FlowchartData[];
}>;

