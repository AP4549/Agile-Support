
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryDistribution, PriorityDistribution } from '@/types';

interface TicketDistributionChartProps {
  categoryData: CategoryDistribution[];
  priorityData: PriorityDistribution[];
}

export function TicketDistributionChart({ 
  categoryData, 
  priorityData 
}: TicketDistributionChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const categoryColors = [
    "#3B82F6", // Blue - Technical
    "#F97316", // Orange - Billing
    "#8B5CF6", // Purple - Feature
    "#10B981", // Green - General
    "#EC4899", // Pink - Account
  ];
  
  const priorityColors = {
    "low": "#10B981", // Green
    "medium": "#F59E0B", // Amber
    "high": "#EF4444", // Red
  };
  
  const renderCategoryChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="category"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tickets`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  const renderPriorityChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={priorityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="priority"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {priorityData.map((entry) => (
              <Cell 
                key={`cell-${entry.priority}`} 
                fill={priorityColors[entry.priority]} 
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tickets`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="category">
          <TabsList className="mb-4">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="priority">By Priority</TabsTrigger>
          </TabsList>
          <TabsContent value="category" className="h-[300px]">
            {isMounted && renderCategoryChart()}
          </TabsContent>
          <TabsContent value="priority" className="h-[300px]">
            {isMounted && renderPriorityChart()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
