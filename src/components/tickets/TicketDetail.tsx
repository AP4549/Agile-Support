
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  MailQuestion, 
  MessageSquare, 
  Shield, 
  Trash2, 
  User, 
  Zap, 
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { AIStatusBadge } from "@/components/AIStatusBadge";
import { Ticket, AgentStatus, TicketAnalysis, TicketSolution } from "@/types";
import { formatDate, formatDateTime, getCategoryLabel, processTicket } from "@/lib/utils";
import { toast } from "sonner";
import { useTicketAnalysis } from "@/hooks/useTicketAnalysis";

interface TicketDetailProps {
  ticket: Ticket;
  agentStatus: AgentStatus;
}

export function TicketDetail({ ticket, agentStatus }: TicketDetailProps) {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [solution, setSolution] = useState<TicketSolution | null>(null);
  const { analyzeTicket, isProcessing } = useTicketAnalysis();
  
  // Analyze ticket with AI
  const handleAnalyzeTicket = async () => {
    if (!agentStatus.connected) {
      toast.error("AI Agent is disconnected", {
        description: "Please check your Ollama connection and try again.",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const results = await analyzeTicket(ticket, agentStatus.model);
      
      // Extract sentiment analysis for the summary
      const sentiment = results?.sentiment || {};
      const sentimentScore = sentiment?.overallSentiment === "positive" ? 0.8 : 
                             sentiment?.overallSentiment === "negative" ? 0.2 : 0.5;
      
      // Extract summary data
      const summaryData = results?.summary || {};
      
      // Extract action data
      const actionsData = results?.actions || {};
      
      // Extract routing data
      const routingData = results?.routing || {};
      
      // Extract time estimation
      const timeData = results?.timeEstimation || {};
      
      // Extract recommendations
      const recommendationsData = results?.recommendations || {};
      
      // Create analysis object
      const analysisObj: any = {
        sentimentScore: sentimentScore,
        estimatedTime: timeData?.estimatedMinutes ? `${timeData.estimatedMinutes} minutes` : "Unknown",
        requiredExpertise: routingData?.recommendedTeam ? [routingData.recommendedTeam] : ["Technical Support"],
        keywords: summaryData?.keyPoints || [],
        similarTickets: ["T002", "T015", "T023"], // This could come from backend but isn't currently implemented
        fullAnalysis: results // Store the full analysis for debugging
      };
      
      // Create solution object
      const solutionObj: TicketSolution = {
        recommendedActions: actionsData?.actions?.map((a: any) => a.description) || [],
        suggestedResponse: recommendationsData?.suggestedResolutions?.[0]?.steps.join(" ") || 
                          "We're analyzing your issue and will get back to you shortly.",
        relatedKnowledgeBase: ["KB001", "KB003", "KB015"], // This could come from backend but isn't currently implemented
        confidence: recommendationsData?.suggestedResolutions?.[0]?.confidence || 0.75,
      };
      
      setAnalysis(analysisObj);
      setSolution(solutionObj);
      
      toast.success("Ticket analyzed successfully", {
        description: "AI has completed the analysis and provided recommendations.",
      });
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Analysis failed", {
        description: err instanceof Error ? err.message : "Failed to analyze ticket",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Simulated ticket update function
  const updateTicketStatus = (newStatus: string) => {
    toast.success(`Ticket ${ticket.id} status updated`, {
      description: `Status changed to ${newStatus}.`,
    });
  };
  
  // Delete ticket
  const deleteTicket = () => {
    toast.success(`Ticket ${ticket.id} deleted`, {
      description: "Ticket has been successfully deleted.",
    });
    navigate("/tickets");
  };
  
  return (
    <div>
      <PageHeader
        title={`Ticket ${ticket.id}`}
        description={ticket.subject}
        actions={
          <div className="flex items-center gap-2">
            <AIStatusBadge status={agentStatus} />
            <Button variant="outline" asChild>
              <a href="/tickets">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </a>
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={deleteTicket}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ticket Details</CardTitle>
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            <CardDescription>
              Reported on {formatDate(ticket.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">{ticket.description}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Customer
                </h3>
                <p className="text-sm">{ticket.customerName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Category
                </h3>
                <p className="text-sm">{getCategoryLabel(ticket.category)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Assigned To
                </h3>
                <p className="text-sm">{ticket.assignedTo || "Unassigned"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Last Updated
                </h3>
                <p className="text-sm">{formatDateTime(ticket.updatedAt)}</p>
              </div>
            </div>
            
            {ticket.resolution && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Resolution
                  </h3>
                  <p className="text-sm">{ticket.resolution}</p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Assign
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => updateTicketStatus("in-progress")}
              >
                Update Status
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* AI support section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              AI Support
            </CardTitle>
            <CardDescription>
              Get AI assistance with this ticket
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysis && !solution ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <MailQuestion className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-center text-muted-foreground">
                  Use AI to analyze this ticket and get recommended solutions.
                </p>
                <Button
                  onClick={handleAnalyzeTicket}
                  disabled={isAnalyzing || isProcessing || !agentStatus.connected}
                  className="w-full"
                >
                  {(isAnalyzing || isProcessing) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="analysis">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-4 mt-4">
                  {analysis && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium">Sentiment</h3>
                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              analysis.sentimentScore < 0.3 
                                ? "bg-red-500" 
                                : analysis.sentimentScore < 0.7 
                                ? "bg-amber-500" 
                                : "bg-green-500"
                            }`}
                            style={{ width: `${analysis.sentimentScore * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysis.sentimentScore < 0.3 
                            ? "Negative" 
                            : analysis.sentimentScore < 0.7 
                            ? "Neutral" 
                            : "Positive"}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Estimated Time</h3>
                        <p className="text-sm mt-1">{analysis.estimatedTime}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Required Expertise</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.requiredExpertise.map((expertise: string) => (
                            <span 
                              key={expertise} 
                              className="text-xs px-2 py-1 bg-secondary rounded-full"
                            >
                              {expertise}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Keywords</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.keywords.map((keyword: string) => (
                            <span 
                              key={keyword} 
                              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Similar Tickets</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.similarTickets.map((ticketId: string) => (
                            <a 
                              key={ticketId}
                              href={`/tickets/${ticketId}`} 
                              className="text-xs px-2 py-1 bg-accent/10 text-accent-foreground rounded-full hover:bg-accent/20"
                            >
                              {ticketId}
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="solution" className="space-y-4 mt-4">
                  {solution && (
                    <>
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertTitle>AI-Generated Solution</AlertTitle>
                        <AlertDescription className="text-xs">
                          Confidence score: {Math.round(solution.confidence * 100)}%
                        </AlertDescription>
                      </Alert>
                      
                      <div>
                        <h3 className="text-sm font-medium">Recommended Actions</h3>
                        <ul className="text-sm mt-1 space-y-1">
                          {solution.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Suggested Response</h3>
                        <p className="text-sm mt-1 bg-muted p-3 rounded-md">
                          {solution.suggestedResponse}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(solution.suggestedResponse);
                            toast.success("Response copied to clipboard");
                          }}
                        >
                          <ClipboardCheck className="mr-1 h-3 w-3" />
                          Copy to clipboard
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Knowledge Base References</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {solution.relatedKnowledgeBase.map((kbId) => (
                            <span 
                              key={kbId} 
                              className="text-xs px-2 py-1 bg-secondary rounded-full"
                            >
                              {kbId}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
