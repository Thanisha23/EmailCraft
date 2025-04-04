import { scheduleEmail } from "./agendaService";
import { Flowchart } from "../models/flowchart.model";
import { EmailSchedule } from "../models/emailSchedule.model";

interface NodeData {
  label?: string;
  to?: string;
  subject?: string;
  body?: string;
  delayHours?: number;
  delayMinutes?: number;
  source?: string;
  emailList?: string[];
}

interface Node {
  id: string;
  type: string;
  data: NodeData;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export async function processFlowchart(flowchartId: string) {
  try {
    const flowchart = await Flowchart.findById(flowchartId);
    if (!flowchart) {
      throw new Error("Flowchart not found");
    }

    const nodes = flowchart.nodes as unknown as Node[];
    const edges = flowchart.edges as unknown as Edge[];

    const leadSourceNodes = nodes.filter((node) => node.type === "leadSource");
    console.log("Processing flowchart:", flowchartId);
    console.log("Nodes:", JSON.stringify(nodes, null, 2));
    console.log("Edges:", JSON.stringify(edges, null, 2));

    for (const sourceNode of leadSourceNodes) {
      if (
        !sourceNode.data.emailList ||
        sourceNode.data.emailList.length === 0
      ) {
        console.log(`Lead source ${sourceNode.id} has no emails to process`);
        continue;
      }

      const paths = findAllPaths(sourceNode.id, nodes, edges);

      for (const path of paths) {
        await processPath(path, nodes, flowchartId, sourceNode.data.emailList);
      }
    }

    return { success: true, message: "Flowchart processed successfully" };
  } catch (error) {
    console.error("Error processing flowchart:", error);
    return { success: false, message: "Error processing flowchart" };
  }
}

function findAllPaths(startNodeId: string, nodes: Node[], edges: Edge[]) {
  const paths: string[][] = [];
  const visited = new Set<string>();

  function dfs(currentNodeId: string, currentPath: string[]) {
    currentPath.push(currentNodeId);
    visited.add(currentNodeId);

    const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId);

    if (outgoingEdges.length === 0) {
      paths.push([...currentPath]);
    } else {
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          dfs(edge.target, [...currentPath]);
        }
      }
    }

    visited.delete(currentNodeId);
  }

  dfs(startNodeId, []);
  return paths;
}

async function processPath(
  path: string[],
  nodes: Node[],
  flowchartId: string,
  recipientEmails: string[]
) {
  const pathNodes = path.map(
    (nodeId) => nodes.find((node) => node.id === nodeId)!
  );

  const emailNodes = pathNodes.filter((node) => node.type === "coldEmail");

  for (const emailNode of emailNodes) {
    const emailNodeIndex = pathNodes.findIndex(
      (node) => node.id === emailNode.id
    );
    const precedingNodes = pathNodes.slice(0, emailNodeIndex);

    let totalDelayMinutes = 0;
    for (const node of precedingNodes) {
      if (node.type === "delay") {
        const hours = node.data.delayHours || 0;
        const minutes = node.data.delayMinutes || 0;
        totalDelayMinutes += hours * 60 + minutes;
      }
    }

    for (const recipientEmail of recipientEmails) {
      const scheduleDate = new Date();
      scheduleDate.setMinutes(scheduleDate.getMinutes() + totalDelayMinutes);

      await EmailSchedule.create({
        flowchartId: flowchartId,
        nodeId: emailNode.id,
        recipient: recipientEmail,
        subject: emailNode.data.subject || "No Subject",
        body: emailNode.data.body || "No content provided",
        scheduledTime: scheduleDate,
        status: "scheduled",
      });

      await scheduleEmail(
        recipientEmail,
        emailNode.data.subject || "No Subject",
        emailNode.data.body || "no content",
        scheduleDate
      );

      console.log(
        `Scheduled email to ${recipientEmail} with ${totalDelayMinutes} minutes delay`
      );
    }
  }
}
