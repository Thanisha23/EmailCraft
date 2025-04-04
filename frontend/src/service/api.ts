import { 
    FlowchartData, 
    EmailData, 
    FlowchartResponse, 
    FlowchartsResponse,
    ApiResponse 
  } from '@/types/flowchart';
import { toast } from 'sonner';
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  export async function saveFlowchart(flowchartData: FlowchartData): Promise<FlowchartResponse> {
    try {
      console.log('Saving flowchart:', flowchartData);
      const response = await fetch(`${API_BASE_URL}/flowchart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(flowchartData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving flowchart:', error);
      toast.error('Failed to save flowchart. Please try again.');
      throw error;
    }
  }
  
  export async function getFlowcharts(): Promise<FlowchartsResponse> {
    try {
      console.log('Fetching flowcharts from:', `${API_BASE_URL}/flowchart`);
      const response = await fetch(`${API_BASE_URL}/flowchart`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Flowcharts response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching flowcharts:', error);
      toast.error('Failed to fetch flowcharts. Please try again.');
      throw error;
    }
  }
  export async function getFlowchartById(id: string): Promise<FlowchartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowchart/${id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching flowchart:', error);
      toast.error('Failed to fetch flowchart. Please try again.');
      throw error;
    }
  }
  
  export async function updateFlowchart(id: string, flowchartData: FlowchartData): Promise<FlowchartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowchart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(flowchartData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating flowchart:', error);
      toast.error('Failed to update flowchart. Please try again.');
      throw error;
    }
  }
  
  export async function deleteFlowchart(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowchart/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting flowchart:', error);
      toast.error('Failed to delete flowchart. Please try again.');
      throw error;
    }
  }
  
  export async function scheduleEmail(emailData: EmailData): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(emailData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error scheduling email:', error);
      toast.error('Failed to schedule email. Please try again.');
      throw error;
    }
  }


export async function processFlowchart(flowchartId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/email/process-flowchart/${flowchartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing flowchart:', error);
    toast.error('Failed to process flowchart. Please try again.');
    throw error;
  }
}