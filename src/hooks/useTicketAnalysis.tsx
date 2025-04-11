import { useState } from 'react';
import { processTicket } from '@/lib/utils';
import { Ticket } from '@/types';
import { toast } from 'sonner';

export function useTicketAnalysis() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeTicket = async (ticket: Ticket, model = "gemma3:4b") => {
    setIsProcessing(true);
    setError(null);
    
    try {
      toast.info("Processing ticket", {
        description: `Using ${model} to analyze ticket content...`,
      });
      
      console.log("Analyzing ticket:", ticket.id, "with model:", model);
      
      // Make the actual API call to the backend
      const analysisResults = await processTicket(ticket, model);
      
      // Check if there was an error returned from the backend
      if (analysisResults.error) {
        throw new Error(analysisResults.error);
      }
      
      setResults(analysisResults);
      
      console.log("Analysis results:", analysisResults);
      
      toast.success("Analysis complete", {
        description: "AI has finished analyzing the ticket",
      });
      
      return analysisResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze ticket";
      setError(errorMessage);
      console.error("Analysis error:", errorMessage);
      
      toast.error("Analysis failed", {
        description: errorMessage,
      });
      
      throw err; // Important: Let the error propagate instead of returning fallback data
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    analyzeTicket,
    isProcessing,
    results,
    error,
  };
}
