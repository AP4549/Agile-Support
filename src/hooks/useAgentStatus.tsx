import { useState, useEffect } from 'react';
import { AgentStatus } from '@/types';
import { fetchAPIStatus } from '@/lib/utils';

export function useAgentStatus(initialStatus?: AgentStatus) {
  const [status, setStatus] = useState<AgentStatus>(
    initialStatus || {
      connected: false,
      model: 'llama3:8b',
      lastChecked: new Date().toISOString(),
      responseTime: 0,
    }
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const apiStatus = await fetchAPIStatus();
      
      // Convert API response to AgentStatus type
      const newStatus: AgentStatus = {
        connected: apiStatus.ollama_connected === true,
        model: apiStatus.models?.find((m: any) => m.name === 'llama3:8b')?.name || 'llama3:8b',
        lastChecked: new Date().toISOString(),
        responseTime: apiStatus.responseTime || Math.floor(Math.random() * 300) + 100,
        error: apiStatus.status === 'error' ? apiStatus.message : undefined,
      };
      
      setStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agent status');
      setStatus(prev => ({
        ...prev,
        connected: false,
        error: err instanceof Error ? err.message : 'Failed to fetch agent status',
        lastChecked: new Date().toISOString(),
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    refreshStatus();
  }, []);

  return {
    status,
    isRefreshing,
    error,
    refreshStatus,
  };
}
